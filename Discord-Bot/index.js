//The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
//The path module is Node's native path utility module. path helps construct paths to access files and directories.
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, } = require('discord.js');
const { token } = require("./config.json");
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//Add .commands property to client instance to access commands in other files.
//The Collection class extends JavaScript's native Map class, and includes more extensive, useful functionality. Collection is used to store and efficiently retrieve commands for execution.
client.commands = new Collection();

//construct a path to the commands directory
const commandsPath = path.join(__dirname, 'commands');
//construct an array of file names of all js files in the commands directory
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//foreach loop to load commandFiles to client.commands
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	//returns function if input is not a /command
	if (!interaction.isChatInputCommand()) return;


	//command is a string if interaction.commandName matches a string in commands, but if it does not match anything it is a boolean set to false. I think. Dynamically typed languages confuse me.
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
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Log in to Discord with your client's token
client.login(token);