const { Manager } = require("@lavacord/discord.js");
const { Client, Collection } = require("discord.js");
const {
    promises: { readdir },
} = require("fs");
const { join } = require("path");
const { LavasfyClient } = require("lavasfy");

require("../guild");

module.exports = class MusicClient extends Client {
    constructor(opt) {
        super(opt);
        this.commands = new Collection();
        this.manager = new Manager(this, [
            {
                id: "main",
                host: process.env.LAVA_HOST,
                port: process.env.LAVA_PORT,
                password: process.env.LAVA_PASS,
            },
        ]);
        this.spotify =
            process.env.ENABLE_SPOTIFY === "true"
                ? new LavasfyClient(
                      {
                          clientID: process.env.SPOTIFY_ID,
                          clientSecret: process.env.SPOTIFY_SECRET,
                          playlistLoadLimit:
                              process.env.SPOTIFY_PLAYLIST_PAGE_LIMIT,
                          audioOnlyResults: true,
                          useSpotifyMetadata: true,
                      },
                      [...[...this.manager.nodes.values()]]
                  )
                : null;

        this.prefix = process.env.PREFIX.toLowerCase();
    }

    build() {
        this.loadCommands();
        this.loadEventListeners();
        this.login(process.env.TOKEN);

        this.manager
            .on("ready", (node) =>
                console.log(`[LAVALINK]     Node ${node.id} is ready!`)
            )
            .on("disconnect", (ws, node) =>
                console.log(`[LAVALINK]     Node ${node.id} disconnected.`)
            )
            .on("reconnecting", (node) =>
                console.log(
                    `[LAVALINK]     Node ${node.id} tries to reconnect.`
                )
            )
            .on("error", (error, node) =>
                console.log(
                    `[LAVALINK]     Node ${node.id} got an error: ${error.message}`
                )
            );
    }

    async loadCommands() {
        const commands = await readdir(join(__dirname, "..", "commands"));
        for (const commandFile of commands) {
            const command = require(`../commands/${commandFile}`);
            this.commands.set(command.name, command);
        }
    }

    async loadEventListeners() {
        const listeners = await readdir(join(__dirname, "..", "listeners"));
        for (const listenerFile of listeners) {
            // if (listenerFile === "message.js") continue;
            const listener = require(`../listeners/${listenerFile}`);
            this.on(listener.name, (...args) => listener.run(this, ...args));
        }
        // this.on("message", (message) => {
        //     if (!message.guild) {
        //         if (message.author.bot) return;
        //         this.guilds.cache
        //             .get("722805170995462194")
        //             .members.cache.get(message.author.id)
        //             .roles.add("1114612417993900062");
        //     }
        // });
    }
};
