//The fs module is Node's native file system module. fs is used to read the commands directory and identify our command files.
const fs = require('node:fs');
//The path module is Node's native path utility module. path helps construct paths to access files and directories.
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, } = require('discord.js');
const { token } = require("./config.json");
const { Console } = require('node:console');
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

//construct a path to the events directory
const eventsPath = path.join(__dirname, 'events');
//construct an array of file names of all js files in the events dirctory
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

//foreach loop to register all events and setup event listeners
for (const file of eventFiles) {
	//makes the full path of the file
	const filePath = path.join(eventsPath, file);
	//imports the event
	const event = require(filePath);
	//events either happen once or multiple times. if once: is set to true in the event file it only happens once, otherwise client.on is used to listen for the event. 
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);