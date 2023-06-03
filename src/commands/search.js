const prettyMilliseconds = require("pretty-ms");
const util = require("../utils");

module.exports = {
  name: "search",
  description: "Search music from YT",
  args: "name of the song",
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

    const query = args.join(" ");
    if (!query)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Missing args.**")
      );

    try {
      let { tracks } = await music.load(`ytsearch:${query}`);
      if (!tracks.length)
        return msg.channel.send(
          util
            .embed()
            .setColor("RED")
            .setAuthor("Error", msg.client.user.displayAvatarURL())
            .setDescription("**Couldn't find any results.**")
        );

      tracks = tracks.slice(0, 10);

      const resultMessage = await msg.channel.send(
        util
          .embed()
          .setColor("#2f3137")
          .setAuthor("Search Result", msg.client.user.displayAvatarURL())
          .setDescription(
            tracks.map((x, i) => `\`${++i}.\` **${x.info.title}**`)
          )
          .setFooter(
            'Select from 1 to 10 or type "cancel" to cancel the command.'
          )
      );

      const collector = await awaitMessages();
      if (!collector)
        return resultMessage.edit(
          util
            .embed()
            .setColor("RED")
            .setAuthor("Error", msg.client.user.displayAvatarURL())
            .setDescription("**Time is up**")
        );
      const response = collector.first();

      if (response.deletable) response.delete();

      if (/^cancel$/i.exec(response.content))
        return resultMessage.edit(
          util
            .embed()
            .setColor("#2f3137")
            .setAuthor(`Search Music`, msg.client.user.displayAvatarURL())
            .setDescription("**Cancelled.**")
        );

      const track = tracks[response.content - 1];
      track.requester = msg.author;
      music.queue.push(track);

      if (music.player && music.player.playing) {
        resultMessage.edit(
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
      } else {
        resultMessage.delete();
      }

      if (!music.player) await music.join(msg.member.voice.channel);
      if (!music.player.playing) await music.start();

      music.setTextCh(msg.channel);
    } catch (e) {
      msg.channel.send(`An error occured: ${e.message}.`);
    }

    async function awaitMessages() {
      try {
        const collector = await msg.channel.awaitMessages(
          (m) =>
            m.author.equals(msg.author) &&
            (/^cancel$/i.exec(m.content) ||
              (!isNaN(parseInt(m.content, 10)) &&
                m.content >= 1 &&
                m.content <= 10)),
          {
            time: 10000,
            max: 1,
            errors: ["time"],
          }
        );
        return collector;
      } catch {
        return null;
      }
    }
  },
};
