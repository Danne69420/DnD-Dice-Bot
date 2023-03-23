const { Events } = require('discord.js');

module.exports = {
    //name: specifies wich Event this file is for.
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};