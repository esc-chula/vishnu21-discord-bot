const util = require("../utils");
const prettyMilliseconds = require("pretty-ms");

const getAttachmentURL = (msg) => (msg.attachments.first() || {}).url;

module.exports = {
  name: "play",
  description: "Queue music from YT or Spotify.",
  aliases: ["p"],
  args: "name of the song | url",
  run: async (msg, args) => {
    const { music } = msg.guild;
    if (!msg.member.voice.channel)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            "**You must be in a voice channel to play something!**"
          )
      );
    if (
      msg.guild.me.voice.channel &&
      !msg.guild.me.voice.channel.equals(msg.member.voice.channel)
    )
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            `**You must be on ${msg.guild.me.voice.channel} to use this command!**`
          )
      );

    const missingPerms = util.missingPerms(
      msg.guild.me.permissionsIn(msg.member.voice.channel),
      ["CONNECT", "SPEAK"]
    );
    if ((!music.player || !music.player.playing) && missingPerms.length)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            `**I need ${missingPerms.length > 1 ? "these" : "this"} permission${
              missingPerms.length > 1 ? "s" : ""
            } on your voice channel: ${missingPerms
              .map((x) => `\`${x}\``)
              .join(", ")}.**`
          )
      );

    if (!music.node || !music.node.connected)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Lavalink node not connected.**")
      );

    const query = args.join(" ") || getAttachmentURL(msg);
    if (!query)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Missing args.**")
      );

    try {
      const {
        loadType,
        playlistInfo: { name },
        tracks,
      } = await music.load(
        util.isValidURL(query) ? query : `ytsearch:${query}`
      );
      if (!tracks.length)
        return msg.channel.send(
          util
            .embed()
            .setColor("RED")
            .setAuthor("Error", msg.client.user.displayAvatarURL())
            .setDescription("**Couldn't find any results.**")
        );

      if (loadType === "PLAYLIST_LOADED") {
        for (const track of tracks) {
          track.requester = msg.author;
          music.queue.push(track);
        }
        msg.channel.send(
          util
            .embed()
            .setColor("#2f3137")
            .setAuthor(
              `Playlist added to queue`,
              msg.client.user.displayAvatarURL()
            )
            .setDescription(name)
            .addField("Enqueued", `\`${tracks.length}\` songs`, false)
        );
      } else {
        const track = tracks[0];
        track.requester = msg.author;
        music.queue.push(track);
        // if (music.player && music.player.playing) console.log(track.info);
        msg.channel.send(
          util
            .embed()
            .setColor("#2f3137")
            .setAuthor(`Added to queue`, msg.client.user.displayAvatarURL())
            .setDescription(`[${track.info.title}](${track.info.uri})`)
            .addField("Author", track.info.author, true)
            .addField(
              "Duration",
              `\`${prettyMilliseconds(track.info.length, {
                colonNotation: true,
              })}\``,
              true
            )
        );
      }

      if (!music.player) await music.join(msg.member.voice.channel);
      if (!music.player.playing) await music.start();

      music.setTextCh(msg.channel);
    } catch (e) {
      msg.channel.send(`An error occured: ${e.message}.`);
    }
  },
};
