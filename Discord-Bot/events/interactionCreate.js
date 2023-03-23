const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        //returns function if input is not a /command
		if (!interaction.isChatInputCommand()) return;

	    //if interaction.commandName matches a string in commands command is a identical string, but if it does not match anything it is a boolean set to false. I think. Dynamically typed languages confuse me.
		const command = interaction.client.commands.get(interaction.commandName);

        //if the command used in the interaction (what the user types into discord) does not match the any of the commands in the commands folder
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

	    //tries to excecute the command. Needs to send interaction along so the excecute function can interact back with the user. Catches and logs any errors
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};