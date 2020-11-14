const Command = require('../../listeners/bases/commandBase');
const { getUserById, getGuildById } = require("../../utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'warns',
            description: 'Check your warns count!',
            cooldown: 3,
            nsfw: false,
            memberPermission: [],
            botPermission: [],
            category: 'Util'
        });
    }

  async execute(message, args) {

     const guildId = message.guild.id;

     const warningNr = args[1];

     const member =
       message.guild.member(message.mentions.users.first()) ||
       message.guild.members.cache.get(args[0]);

     if (!member) {
       return message.channel.send("Not a valid member.");
     }

     const guild = await getGuildById(guildId);
     const { warnings } = await getUserById(member.user.id, message.guild.id);

     const embed = new MessageEmbed()
       .setColor("BLUE")
       .setTimestamp()
       .setFooter(message.author.username);

     if (warningNr) {
       const warning = warnings.filter((w, idx) => idx === warningNr - 1)[0];

       if (!warning) {
         return message.channel.send(
           `\`${member.user.tag}\` has no warnings.`
         );
       }

       embed
         .setTitle(`Warn: ${warningNr}`)
         .addField("**Reason**", warning.reason || "*No reason*");

       return message.channel.send({ embed });
     }

     embed
       .setAuthor(`Warnings of ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
       .addField("**Warns count**", warnings.length || 0)
       .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
       .setDescription(
         `Use \`;warnings <@user> <warn number>\` to get info about the specified warning.`
       );

     message.channel.send({ embed });


    }
};
