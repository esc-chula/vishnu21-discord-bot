const api = require("./api");
const util = require("../utils");
const prettyMilliseconds = require("pretty-ms");

module.exports = class Handler {
    constructor(guild) {
        this.guild = guild;
        this.volume = process.env.VOLUME;
        this.loop = 0; // 0 = none; 1 = track; 2 = queue;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.textChannel = null;
        this.shouldSkipCurrent = false;
        this.timer;
    }

    get voiceChannel() {
        return this.guild.me.voice.channel;
    }

    get client() {
        return this.guild.client;
    }

    get player() {
        return this.client.manager.players.get(this.guild.id) || null;
    }

    get node() {
        return this.client.manager.nodes.get("main");
    }

    reset() {
        this.loop = 0;
        this.volume = process.env.VOLUME;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.textChannel = null;
    }

    async join(voice) {
        if (this.player) return;
        await this.client.manager.join(
            {
                channel: voice.id,
                guild: this.guild.id,
                node: this.node.id,
            },
            { selfdeaf: true }
        );

        this.player
            .on("start", () => {
                this.current = this.queue.shift();
                const track = this.current;

                // set volume
                this.player.volume(this.volume);

                if (this.textChannel)
                    this.textChannel.send(
                        util
                            .embed()
                            .setColor("#2f3137")
                            .setAuthor(
                                `Now playing ♪`,
                                this.client.user.displayAvatarURL()
                            )
                            .setDescription(
                                `🎶 | Now playing **${track.info.title}**.`
                            )
                            .setDescription(
                                `[${track.info.title}](${track.info.uri})`
                            )
                            .addField(
                                "Requested by",
                                `${track.requester}`,
                                true
                            )
                            .addField(
                                "Duration",
                                `\`${prettyMilliseconds(track.info.length, {
                                    colonNotation: true,
                                })}\``,
                                true
                            )
                    );
            })
            .on("end", (data) => {
                if (data.reason === "REPLACED") return;
                this.previous = this.current;
                this.current = null;

                if (this.loop === 1 && !this.shouldSkipCurrent)
                    this.queue.unshift(this.previous);
                else if (this.loop === 2) this.queue.push(this.previous);

                if (this.shouldSkipCurrent) this.shouldSkipCurrent = false;

                if (!this.queue.length) {
                    if (this.textChannel)
                        this.textChannel.send(
                            util
                                .embed()
                                .setColor("#2f3137")
                                .setAuthor(
                                    "The queue has ended",
                                    this.client.user.displayAvatarURL()
                                )
                                .setTimestamp()
                        );
                    this.reset();
                    this.startTimeout();
                    return;
                }
                this.start();
            })
            .on("error", console.error);
    }

    setTextCh(text) {
        this.textChannel = text;
    }

    async load(query) {
        const res = await api.load(this.node, query, this.client.spotify);
        return res;
    }

    async start() {
        if (!this.player) return;
        await this.clearTimeout();
        await this.player.play(this.queue[0].track);
    }

    async pause() {
        if (!this.player) return;
        if (!this.player.paused) await this.player.pause(true);
    }

    async resume() {
        if (!this.player) return;
        if (this.player.paused) await this.player.pause(false);
    }

    async skip(to = 1) {
        if (!this.player) return;
        if (to > 1) {
            this.queue.unshift(this.queue[to - 1]);
            this.queue.splice(to, 1);
        }
        if (this.loop === 1 && this.queue[0]) this.shouldSkipCurrent = true;
        await this.player.stop();
    }

    async stop() {
        if (!this.player) return;
        this.loop = 0;
        this.queue = [];
        await this.skip();
        await this.clearTimeout();
        this.client.manager.leave(this.guild.id);
    }

    async startTimeout() {
        this.timer = setTimeout(() => {
            this.client.manager.leave(this.guild.id);
        }, 300000);
    }

    async clearTimeout() {
        clearTimeout(this.timer);
    }
};
