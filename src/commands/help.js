const util = require("../utils");

module.exports = {
  name: "help",
  description: "List of commands.",
  aliases: ["commands", "?", "h"],
  run: (msg) => {
    const commands = [];

    msg.client.commands.map((command) => commands.push(command));

    const commandsLength = Math.ceil(commands.length / 2);

    const leftCol = commands.slice(0, commandsLength);
    const rightCol = commands.slice(commandsLength);

    const embed = util
      .embed()
      .setColor("#2f3137")
      .setAuthor("Command List", msg.client.user.displayAvatarURL())
      .addFields(
        {
          name: "\u200B",
          value: leftCol.map((data) => {
            return `**${process.env.PREFIX}${data.name}**\xa0\xa0${
              data.args ? `[${data.args}]` : ""
            }\n\xa0\xa0${data.description}\n`;
          }),
          inline: true,
        },
        {
          name: "\u200B",
          value: rightCol.map((data) => {
            return `**${process.env.PREFIX}${data.name}**\xa0\xa0${
              data.args ? `[${data.args}]` : ""
            }\n\xa0\xa0${data.description}\n`;
          }),
          inline: true,
        }
      );

    msg.channel.send(embed);
  },
};
