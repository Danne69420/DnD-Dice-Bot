const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports ={
    data: new SlashCommandBuilder()
        .setName('view-all-characters')
        .setDescription("displays all saved characters"),

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

                })
            }

        })
    }
}