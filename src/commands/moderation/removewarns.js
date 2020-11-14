const Command = require('../../listeners/bases/commandBase');
const { getUserById, removeUserWarnings } = require("../../utils/functions");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'removewarns',
            description: 'Remove the warns from specified member!',
            cooldown: 3,
            nsfw: false,
            memberPermission: ["MANAGE_MESSAGES"],
            botPermission: [],
            category: 'Moderation'
        });
    }

  async execute(message, args) {

    const guildId = message.guild.id;
     const member =
       message.guild.member(message.mentions.users.first()) ||
       message.guild.members.cache.get(args[1]);
     const { warnings } = await getUserById(member.id, guildId);

     if (!member) {
       return message.channel.send("Not a valid member.");
     }

     if (warnings === null || !warnings[0]) {
       return message.channel.send("This member has no warnings to remove.");
     }

     await removeUserWarnings(member.id, guildId);

     return message.channel.send(`Suucessfully removed all warnings from \`${member.user.tag}\``);

    }
};
