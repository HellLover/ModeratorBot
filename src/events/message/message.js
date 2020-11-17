require('dotenv/config');
const Event = require('../../listeners/bases/eventBase');
const { Collection } = require('discord.js');

const { getGuildById, updateUserById } = require("../../utils/functions");

const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO_URI);

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            name: 'message',
        });
    }

    async execute(message) {
        if(!message.content.startsWith(this.client.prefix)) return;
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;
        xp(message);

        const [commandName, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(commandName)
            || this.client.commands.get(this.client.aliases.get(commandName));

       const guildId = message.guild.id;
       const guild = await getGuildById(guildId);
       const customCmds = guild.custom_commands;

        if (customCmds) {
            const customCmd = customCmds.find((x) => x.name === commandName);
            if (customCmd) message.channel.send(customCmd.response);
        }

        if (!command) return;

        if (command.ownerOnly && message.member.id !== process.env.BOT_OWNERID) {
            return message.react("❌");
        }

        if (command.nsfw && !message.channel.nsfw) {
            return;
        }

        if (command.cooldown) {
            const { cooldowns } = this.client;

            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.channel.send(`Please wait ${timeLeft.toFixed(1)} second(s) to use the command again.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.memberPermission && !message.member.hasPermission(command.memberPermission)) {
            return;
        }

        if (command.botPermission && !message.guild.me.hasPermission(command.botPermission)) {
            const botPermissions = command.botPermission.map(perm => `\`${perm.toLowerCase().replace(/_/g, ' ')}\``).join(', ');
            return;
        }

        try {
            command.execute(message, args);
        }
        catch (error) {
            console.log(`An error occured: ${error}`);
        }
    }
};

  async function xp(message) {
      if(message.author.bot) return;
      if(message.content.startsWith(process.env.PREFIX)) return;

        const randomXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
        const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);

    if(hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.channel.send(`\`${message.author.tag}\` has just leveled up to level **${user.level}** :tada:`);

        const levelRole = message.guild.roles.cache.find(role => role.name === `Level ${user.level}`);
        if(!levelRole) return;

        if(message.member.roles.cache.has(levelRole.id)) return;
        message.member.roles.add(levelRole.id);
    }
}
