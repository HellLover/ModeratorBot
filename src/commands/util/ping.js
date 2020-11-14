const Command = require('../../listeners/bases/commandBase');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ping',
            description: 'Get the latency of the bot!',
            cooldown: 3,
            category: 'Util'
        });
    }

    async execute(message) {
        const msg = await message.channel.send('Checking the latency...');
        const messagePing = msg.createdTimestamp - message.createdTimestamp;
        msg.edit(`🏓 Pong! Took \`${messagePing}ms\` to send the message.\nHeartbeat: \`${this.client.ws.ping}ms\``);
    }
};
