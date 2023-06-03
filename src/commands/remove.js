const util = require("../utils");

module.exports = {
  name: "remove",
  description: "Remove music from the queue.",
  aliases: ["rm"],
  args: "song's index",
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

    if (!args[0])
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Missing args.**")
      );

    let iToRemove = parseInt(args[0], 10);
    if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Invalid number to remove.**")
      );

    const removed = music.queue.splice(--iToRemove, 1)[0];
    msg.channel.send(
      util
        .embed()
        .setColor("#2f3137")
        .setAuthor("Remove Queue", msg.client.user.displayAvatarURL())
        .setDescription(`Removed **${removed.info.title}** from the queue.`)
    );
  },
};
