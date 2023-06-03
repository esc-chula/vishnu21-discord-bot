const util = require("../utils");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = {
  name: "seek",
  description: "Seeking the song.",
  args: "position in the song - Ex. 1:23",
  run: async (msg, args) => {
    const { music } = msg.guild;
    if (!music.player || !music.player.playing)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Nothing is playing right now...**")
      );
    if (!msg.member.voice.channel)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            "**You must be in a voice channel to use this command!**"
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

    if (!music.current.info.isSeekable)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(`**Current track isn't seekable**`)
      );
    const duration = args[0];
    if (!duration)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            "**You must provide duration to seek. Valid duration e.g. `1:34`.**"
          )
      );
    if (!durationPattern.test(duration))
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            "**You provided an invalid duration. Valid duration e.g. `1:34`.**"
          )
      );

    const durationMs = util.durationToMillis(duration);
    if (durationMs > music.current.info.length)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            "**The duration you provide exceeds the duration of the current track..**"
          )
      );

    try {
      await music.player.seek(durationMs);
      msg.channel.send(
        util
          .embed()
          .setColor("#2f3137")
          .setAuthor("Seeking the song", msg.client.user.displayAvatarURL())
          .setDescription(`**Seeked to ${util.millisToDuration(durationMs)}.**`)
      );
    } catch (e) {
      msg.channel.send(`An error occured: ${e.message}.`);
    }
  },
};
