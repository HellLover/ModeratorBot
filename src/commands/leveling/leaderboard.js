const Command = require('../../listeners/bases/commandBase');
const { MessageEmbed } = require("discord.js");
const Levels = require("discord-xp");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'leaderboard',
            description: 'Rank leaderboard',
            cooldown: 3,
            category: 'Leveling',
            aliases: ["lb"]
        });
    }

    async execute(message, args) {

      let raw = await Levels.fetchLeaderboard(message.guild.id, 10);
      if (raw.length < 1) return reply("Cannot construct the leaderboard yet");
      let data = Levels.computeLeaderboard(this.client, raw);

      let leaderboard = data.map(e =>
        `**${e.position === 1 ? "🥇" : e.position && e.position === 2 ? "🥈" : e.position && e.position === 3 ? "🥉" : e.position}**. **${e.username}#${e.discriminator}** — Level: **${e.level || 1}** | XP: **${e.xp.toLocaleString()}**`
      );

      const lbEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setThumbnail(message.guild.iconURL({ dynamic: true, format: "png", size: 2048 }))
      .setAuthor("Rank Leaderboard", message.guild.iconURL({ dynamic: true }))
      .setDescription(leaderboard)
      message.channel.send(lbEmbed)

    }
};
