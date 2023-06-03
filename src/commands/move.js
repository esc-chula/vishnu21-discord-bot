const util = require("../utils");

module.exports = {
  name: "move",
  description: "Move the song in queue.",
  aliases: ["mv"],
  args: "song's index",
  run: async (msg, args) => {
    const { music } = msg.guild;
    const from = args[0] ? parseInt(args[0], 10) : null;
    const to = args[1] ? parseInt(args[1], 10) : null;
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

    if (from === null || to === null)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription(
            `**Missing args. Example usage e.g. \`${msg.client.prefix}move 2 1\`**`
          )
      );

    if (
      from === to ||
      isNaN(from) ||
      from < 1 ||
      from > music.queue.length ||
      isNaN(to) ||
      to < 1 ||
      to > music.queue.length
    )
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Number is invalid or exceeds queue length.**")
      );

    const moved = music.queue[from - 1];

    util.moveArrayElement(music.queue, from - 1, to - 1);

    msg.channel.send(
      util
        .embed()
        .setColor("#2f3137")
        .setAuthor("Move song in queue", msg.client.user.displayAvatarURL())
        .setDescription(`**Moved **${moved.info.title}** to \`${to}\`.**`)
    );
  },
};
