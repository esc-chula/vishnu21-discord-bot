const util = require("../utils");

const modes = ["none", "track", "queue"];
const aliases = {
  single: "track",
  track: "track",
  song: "track",
  this: "track",
  current: "track",
  all: "queue",
  every: "queue",
  queue: "queue",
  off: "none",
  none: "none",
  nothing: "none",
};

module.exports = {
  name: "loop",
  description: "Loop *queue* or *track*",
  aliases: ["repeat"],
  args: "none | track | queue",
  run: (msg, args) => {
    const { music } = msg.guild;
    if (!music.player)
      return msg.channel.send(
        util
          .embed()
          .setColor("RED")
          .setAuthor("Error", msg.client.user.displayAvatarURL())
          .setDescription("**Nothing is playing right now...**")
      );
    if (args[0]) {
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

      const loopMode = aliases[args[0].toLowerCase()];
      if (loopMode && modes.includes(loopMode)) {
        music.loop = modes.indexOf(loopMode);
        msg.channel.send(
          util
            .embed()
            .setColor("#2f3137")
            .setAuthor("Looping", msg.client.user.displayAvatarURL())
            .setDescription(
              music.loop === 0
                ? "**Loop disabled.**"
                : `**Set loop to ${modes[music.loop]}.**`
            )
        );
      } else {
        msg.channel.send(
          util
            .embed()
            .setColor("RED")
            .setAuthor("Error", msg.client.user.displayAvatarURL())
            .setDescription("**Invalid loop mode. Try single/all/off.**")
        );
      }
    } else {
      msg.channel.send(
        util
          .embed()
          .setColor("#2f3137")
          .setAuthor("Looping", msg.client.user.displayAvatarURL())
          .setDescription(`**Current loop mode: ${modes[music.loop]}**`)
      );
    }
  },
};
