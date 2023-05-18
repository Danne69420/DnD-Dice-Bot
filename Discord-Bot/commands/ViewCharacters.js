const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
//this command doesn't really work properly. savedcharacters.json is probably not going to work. Maybe just have it try to load all the files in ./PDFs.
module.exports ={
    data: new SlashCommandBuilder()
        .setName('view-all-characters')
        .setDescription("displays all saved characters and their stats"),

    async execute(interaction) {
        fs.readFile("./PDFs/savedCharacters.json", "utf-8", (err, jsonString) => {
            if(err){
                console.log("File read failed:", err);
                return;
            }
            const savedCharacters = JSON.parse(jsonString);
            characterArray = savedCharacters.split(",")
            for(let i = 0; i < characterArray.length; i++){
                fs.readFile("./PDFs/" + characterArray[i], "utf-8", (err, jsonString) =>{
                    if(err){
                        console.log("error reading json file: ", err);
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
        
                })
            }

        })
    }
}