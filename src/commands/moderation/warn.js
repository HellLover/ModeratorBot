const Command = require('../../listeners/bases/commandBase');
const { getUserById, addWarning } = require("../../utils/functions");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'warn',
            description: 'Warn the member!',
            cooldown: 3,
            nsfw: false,
            memberPermission: ["MANAGE_MESSAGES"],
            botPermission: [],
            category: 'Moderation'
        });
    }

  async execute(message, args) {

   const reason = args.slice(1).join(" ");

   const member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

   if (!member) {
     return message.channel.send("Could not find the member.");
   }

   if (member.hasPermission("MANAGE_MESSAGES")) {
     return message.channel.send("The moderator cannot be warned.");
   }

   await addWarning(member.user.id, message.guild.id, reason);

   const { warnings } = await getUserById(member.user.id, message.guild.id);

   return message.channel.send(
     `Successfully warned \`${member.user.tag}\` with reason: \`${reason}\` (Total warns: \`${
       warnings ? warnings.length : "0"
     }\`)`
   );


    }
};
