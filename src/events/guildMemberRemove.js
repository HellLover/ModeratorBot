const Event = require('../listeners/bases/eventBase');

let stats = {
    serverID: '715290558779883532',
    total: "715505766450331759",
    channels: "740668969093955624",
    roles: "740670170275774614"
}

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            name: 'guildMemberRemove',
            once: true,
        });
    }

    async execute(member) {
        this.client.channels.cache.get("715496816241672213").send(`:flag_gb: | **${member.user.tag}** has left the server!\n:flag_ru: | **${member.user.tag}** покинул сервер!`)

        if(member.guild.id !== stats.serverID) return;
      client.channels.cache.get(stats.total).setName(`Member Count: ${member.guild.memberCount}`);
      client.channels.cache.get(stats.channels).setName(`Channels: ${member.guild.channels.cache.size}`);
      client.channels.cache.get(stats.roles).setName(`Roles: ${member.guild.roles.cache.size}`);
    }
};
