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
        
        let characterName = interaction.options.getString('character');
        characterName = characterName.replace(/\s/g, "_")
        fs.readFile("./PDFs/" + characterName + ".fields.json", "utf-8", (err, jsonString) =>{
            if(err){
                console.log("File Read Failed:", err )
                return;
            }
            const character = JSON.parse(jsonString);
            let replyString = "";
            for(let i = 0; i < character.length; i++){
                if(character[i].type === 'alpha' && character[i].value != ''){
                    console.log(character[i].id + ": " + character[i].value);
                    replyString += "\n" + character[i].id + ": " + character[i].value;
                }
            }
            interaction.reply(replyString);
        })

    },
}
