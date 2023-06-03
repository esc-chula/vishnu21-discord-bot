const util = require("../utils");

module.exports = {
  name: "skip",
  description: "Skip current track.",
  aliases: ["s"],
  args: "nothing | song's index",
  run: async (msg, args) => {
    const { music } = msg.guild;
    const skipTo = args[0] ? parseInt(args[0], 10) : null;
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

    if (
      skipTo !== null &&
      (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length)
    )
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(`**Invalid number to skip!**`)
      );

    try {
      await music.skip(skipTo);
      msg.react("⏭️").catch((e) => e);
    } catch (e) {
      msg.channel.send(`An error occured: ${e.message}.`);
    }
  },
};
