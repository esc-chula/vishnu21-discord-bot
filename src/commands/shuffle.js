const util = require("../utils");

module.exports = {
  name: "shuffle",
  description: "Shuffle the queue.",
  aliases: ["sf"],
  run: async (msg) => {
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

    music.queue = util.shuffleArray(music.queue);

    msg.channel.send(
      util
        .embed()
        .setColor("#2f3137")
        .setAuthor("Shuffle queue", msg.client.user.displayAvatarURL())
        .setDescription(
          `**Queue shuffled! Type \`${msg.client.prefix}queue\` to see changes.**`
        )
    );
  },
};
