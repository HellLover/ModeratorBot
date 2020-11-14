const Command = require('../../listeners/bases/commandBase');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'List of all available commands!',
            category: 'Util',
        });
    }

    async execute(message, args) {
        const embed = new MessageEmbed()
            .setColor('BLUE');

        const command = this.client.commands.get(args[0]);

        if (command) {
            embed.setAuthor(command.name, this.client.user.displayAvatarURL())
            embed.setDescription([
                `**Name:** ${command.name}`,
                `**Description:** ${command.description || 'None'}`,
                `**Usage:** ${command.usage || 'None'}`,
                `**Aliases:** ${command.aliases.length ? command.aliases.map(alias => `\`${alias}\``).join(' ') : 'None'}`,
            ]);
        }
        else {
            const categories = this.client.util.removeDuplicates(this.client.commands.map(c => c.category));
            embed.setDescription('Use `;help <command>` to get more info about the command.');

            for (const category of categories) {
                embed.addField(category || 'Misc', this.client.commands.filter(c => c.category === category).map(c => `\`${c.name}\``).join(' | '));
            }
        }

        message.channel.send({ embed: embed });
    }
};
