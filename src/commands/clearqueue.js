const util = require("../utils");

module.exports = {
  name: "clearqueue",
  description: "Clean up the queue.",
  aliases: ["clr", "clear"],
  run: (msg) => {
    const { music } = msg.guild;
    if (!music.player)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Nothing is playing right now...**")
      );
    if (!music.queue.length)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**The queue is empty.**")
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

    music.queue.splice(0, music.queue.length);
    msg.channel
      .send(
        util
          .embed()
          .setColor("#2f3137")
          .setAuthor("Clearing queue", msg.client.user.displayAvatarURL())
          .setDescription("**Cleared the queue.**")
          .setTimestamp()
      )
      .catch((e) => e);
  },
};
