const util = require("../utils");

module.exports = {
  name: "nowplaying",
  description: "See what's playing rightnow.",
  aliases: ["np", "nowplay"],
  run: (msg) => {
    const { music } = msg.guild;
    if (!music.player || !music.player.playing)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setDescription("**Nothing is playing right now...**")
      );
    const progress = util.progress(
      music.player.state.position,
      music.current.info.length
    );
    msg.channel.send(
      util
        .embed()
        .setColor("#2f3137")
        .setDescription(
          `[${music.current.info.title}](${music.current.info.uri})`
        )
        .setAuthor("Currently playing", msg.client.user.displayAvatarURL())
        .addField("Requested by", `${music.current.requester}`, true)
        .addField(
          "Duration",
          `${
            music.current.info.isStream
              ? ""
              : `\n\n${util.millisToDuration(music.player.state.position)} ${
                  progress.bar
                } ${util.millisToDuration(music.current.info.length)}`
          }`
        )
    );
  },
};
