require('dotenv/config');
const Event = require('../../listeners/bases/eventBase');
const { Collection } = require('discord.js');

const { getGuildById } = require("../../utils/functions")

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            name: 'message',
        });
    }

    async execute(message) {
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;

        let substringArray = get_substrings_between(message.content, ":", ":")
        let msg = message.content;
        if(!substringArray.length) return;

        substringArray.forEach(m => {
          let emoji = this.client.emojis.cache.find(x => x.name === m)
          var replace = `:${m}:`;
          var rexreplace = new RegExp(replace, 'g');

          if(emoji && !msg.split(" ").find(x => x === emoji.toString()) && !msg.includes(`<a${replace}${emoji.id}>`)) msg = msg.replace(rexreplace, emoji.toString());
        })

        if(msg === message.content) return;

        let webhook = await message.channel.fetchWebhooks();
        webhook = webhook.find(x => x.name === "DolphinEmojis");

        if(!webhook) {
          webhook = await message.channel.createWebhook('DolphinEmojis', {
            avatar: this.client.user.displayAvatarURL({ dynamic: false })
          });
        }

        await webhook.edit({
          name: message.member.nickname ? message.member.nickname : message.author.username,
          avatar: message.author.displayAvatarURL({ dynamic: true })
        })

        message.delete().catch(m => {})

        webhook.send(msg).catch(m => {});

        await webhook.edit({
          name: 'DolphinEmojis',
          avatar: this.client.user.displayAvatarURL({ dynamic: false })
        })

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

    function get_substrings_between(str, startDelimiter, endDelimiter) {
      var contents = [];
      var startDelimiterLength = startDelimiter.length;
      var endDelimiterLength = endDelimiter.length;
      var startFrom = contentStart = contentEnd = 0;

      while(false !== (contentStart = strpos(str, startDelimiter, startFrom))) {
        contentStart += startDelimiterLength;
        contentEnd = strpos(str, endDelimiter, contentStart);
        if(false === contentEnd) {
          break;
        }
        contents.push(str.substr(contentStart, contentEnd - contentStart));
        startFrom = contentEnd + endDelimiterLength;
      }

      return contents;
    }

    function strpos(haystack, needle, offset) {
      var i = (haystack + '').indexOf(needle, (offset || 0));
      return i === -1 ? false : i;
    }
