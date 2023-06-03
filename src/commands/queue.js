const util = require("../utils");

module.exports = {
  name: "queue",
  description: "Display all the queue.",
  aliases: ["q"],
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

    const queue = music.queue.map(
      (t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`
    );
    const chunked = util.chunk(queue, 10).map((x) => x.join("\n"));

    const embed = util
      .embed()
      .setColor("#2f3137")
      .setAuthor(`Music Queue`, msg.client.user.displayAvatarURL())
      .setDescription(chunked[0])
      .setFooter(`Page 1 of ${chunked.length}.`);

    try {
      const queueMsg = await msg.channel.send(embed);
      if (chunked.length > 1)
        await util.pagination(queueMsg, msg.author, chunked);
    } catch (e) {
      msg.channel.send(`An error occured: ${e.message}.`);
    }
  },
};
