const Command = require('../../listeners/bases/commandBase');
const { getUserById, calculateUserXp } = require("../../utils/functions");
const canvacord = require("canvacord");
const Discord = require("discord.js");
const Levels = require("discord-xp");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'rank',
            description: 'Check your level!',
            cooldown: 3,
            category: 'Leveling',
            aliases: ["lvl", "level"]
        });
    }

    async execute(message, args) {

        const member = this.client.getMember(message, args, true);
        const avatar = member.user.displayAvatarURL({ format: "png" });

        if (member.user.bot) return message.channel.send("That is a bot")

        const kek = await Levels.fetch(member.id, message.guild.id);
        if (!kek) return message.channel.send("No xp data found")

        if(kek.level == 0) kek.level = 1

        let requiredXp = await Levels.xpFor(parseInt(kek.level) + 1)

        const rank = new canvacord.Rank()
                  .setAvatar(avatar)
                  .setCurrentXP(kek.xp)
                  .renderEmojis(true)
                  .setRequiredXP(requiredXp)
                  .setLevel(kek.level)
                  .setRank(1, "RANK", false)
                  .setStatus(member.user.presence.status, true, true)
                  .setProgressBar(["#FF0000", "#fdfbfb"], "GRADIENT")
                  .setUsername(member.user.username)
                  .setDiscriminator(member.user.discriminator)

              rank.build()
                  .then(data => {
                      message.channel.send(new Discord.MessageAttachment(data, `Rank_${member.user.username}.png`))
                  })

    }
};
