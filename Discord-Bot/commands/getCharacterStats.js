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
        characterName = characterName.replace(/\s/g, "_")   //regex, replaces all whitespace with _
        fs.readFile("./PDFs/" + characterName + ".fields.json", "utf-8", (err, jsonString) =>{
            if(err){
                console.log("File Read Failed:", err )
                //err.code === 'ENOENT' means that the file does not exist
                if(err.code === 'ENOENT'){
                    interaction.reply("could not find that character. (Did you spell their name correctly?)")
                }
                else{
                    interaction.reply("Error: ", err)
                }
                return;
            }
            const character = JSON.parse(jsonString);
            let replyString = "";
            for(let i = 0; i < character.length; i++){
                //type === alpha means it is a textbox
                if(character[i].type === 'alpha' && character[i].value != ''){
                    console.log(character[i].id + ": " + character[i].value);
                    replyString += "\n" + character[i].id + ": " + character[i].value;
                }
            }
            interaction.reply(replyString);
        })

    },
}
