const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports ={
    data: new SlashCommandBuilder()
	    .setName('get-character-stats')
	    .setDescription('view the stats of a specific character')
	    .addStringOption(option =>
		    option.setName('character')
			    .setDescription('the name of the character whose stats you want to view')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply(interaction.options.getString('character'));
        
        let characterName = interaction.options.getString('character');
        characterName = characterName.replace(/\s/g, "_")
        fs.readFile("./PDFs/" + characterName + ".fields.json", "utf-8", (err, jsonString) =>{
            if(err){
                console.log("File Read Failed:", err )
                return;
            }
            const character = JSON.parse(jsonString);
            console.log(character[46]);
        })

    },
}
