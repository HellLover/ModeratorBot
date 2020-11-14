const Command = require('../../listeners/bases/commandBase');
const { getGuildById, updateGuildById } = require("../../utils/functions");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'deletetag',
            description: 'Delete a tag/command!',
            cooldown: 3,
            nsfw: false,
            memberPermission: ["MANAGE_GUILD"],
            botPermission: [],
            category: 'Moderation'
        });
    }

    async execute(message, args) {

    const cmdName = args[0];
    const guild = await getGuildById(message.guild.id);
    const commands = guild.custom_commands;

    if (!cmdName) {
      return message.channel.send(
        ":x: Provide a tag name to delete."
      );
    }

    if (commands) {
      const data = commands.find((cmd) => cmd.name === cmdName.toLowerCase());

      if (!data) {
        return message.channel.send(":x: Could not find the command.");
      }

      const filtered = commands.filter(
        (cmd) => cmd.name !== cmdName.toLowerCase()
      );

      await updateGuildById(message.guild.id, {
        custom_commands: filtered,
      });
      return message.channel.send(`Successfully deleted the **${cmdName}** tag!`);
    } else {
      return message.channel.send(
        ":x: Could not find the command!"
      );
    }


    }
};
