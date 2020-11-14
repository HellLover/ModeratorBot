const Command = require('../../listeners/bases/commandBase');
const { getGuildById, updateGuildById } = require("../../utils/functions");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'addtag',
            description: 'Add a tag/command!',
            cooldown: 3,
            nsfw: false,
            memberPermission: ["MANAGE_GUILD"],
            botPermission: [],
            category: 'Moderation'
        });
    }

    async execute(message, args) {

      const cmdName = args[0];
      const cmdResponse = args.slice(1).join(" ");

  if (!cmdName) {
    return message.channel.send(
      ":x: Include a tag to add."
    );
  }

  if (!cmdResponse) {
    return message.channel.send(
      ":x: You didn\'t specify the tag response."
    );
  }

  const guild = await getGuildById(message.guild.id);
  const commands = guild.custom_commands;

  if (commands && commands.find((x) => x.name === cmdName.toLowerCase()))
    return message.channel.send(
      ":x: This tag is already exists."
    );

  if (this.client.commands.has(cmdName)) {
    return message.channel.send(
      ":x: That tag cannot be created, because there is a command in the bot like that!"
    );
  }

  const data = {
    name: cmdName.toLowerCase(),
    response: cmdResponse,
  };

  if (!commands) {
    await updateGuildById(message.guild.id, { custom_commands: [data] });
  } else {
    await updateGuildById(message.guild.id, {
      custom_commands: [...commands, data],
    });
  }

  message.channel.send(
    "Successfully added the \`" + cmdName.toLowerCase() + "\` tag."
  );


    }
};
