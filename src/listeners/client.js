require('dotenv/config');
const { Client, Collection } = require('discord.js');
const { eventRegistry, commandRegistry } = require('../registries/export/index');
const Util = require('./util');
const { getMember } = require("../utils/functions")

module.exports = class DiscordClient extends Client {

    constructor() {
        super({
            disableMentions: 'everyone',
        });

        this.events = new Collection();
        this.commands = new Collection();
        this.aliases = new Collection();
        this.cooldowns = new Collection();
        this.util = new Util(this);
        this.prefix = process.env.PREFIX;
        this.getMember = getMember;
    }

    async start() {
        super.login(process.env.BOT_TOKEN);
        eventRegistry(this);
        commandRegistry(this);
    }
};
