const util = require("../utils");

module.exports = {
  name: "previous",
  description: "Jump to previos track.",
  aliases: ["prev"],
  run: async (msg) => {
    const { music } = msg.guild;
    if (!music.player)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Nothing is playing right now...**")
      );
    if (!music.previous)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**There is no previos track.**")
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

    try {
      music.queue.unshift(music.previous);
      await music.skip();
      msg.react("⏮️").catch((e) => e);
    } catch (e) {
      msg.channel.send(`An error occured: ${e.message}.`);
    }
  },
};
