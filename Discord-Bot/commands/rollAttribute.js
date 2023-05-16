const { SlashCommandBuilder } = require('discord.js');
//https://www.npmjs.com/package/@dice-roller/rpg-dice-roller?activeTab=readme
const rpgDiceRoller = require('@dice-roller/rpg-dice-roller');
const fs = require('fs');

var dice = {
    roll: function (input) {


      const roll = new rpgDiceRoller.DiceRoll(input);
      return roll.output;
    }
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll-attribute')
		.setDescription('Rolls a attribute (STR for example) check for a character')
    .addStringOption( option =>
      option.setName('character')
        .setDescription('the character to roll the check with')
        .setRequired(true))
    .addStringOption( option =>
      option.setName('attribute')
        .setDescription('the type of check to roll')
        //Could something similar be used for selection the character? maybe using savedCharacters.json?
        .addChoices(
            {name: 'STR', value: 'STRmod'},
            {name: 'DEX', value: 'DEXmod'},
            {name: 'CON', value: 'CONmod'},
            {name: 'INT', value: 'INTmod'},
            {name: 'WIS', value: 'WISmod'},
            {name: 'CHA', value: 'CHAmod'},
        )
        .setRequired(true)),
    
	async execute(interaction) {
    const attribute = interaction.options.getString('attribute');
    var characterName = interaction.options.getString('character')
    characterName = characterName.replace(/\s/g, "_")
    var diceRoll = "";
    fs.readFile("./PDFs/" + characterName + ".fields.json", "utf-8", (err, jsonString) =>{
        if(err){
            console.log("File Read Failed:", err )
            return;
        }
        //this array will contain a array of all the stats of the character
        const character = JSON.parse(jsonString);
        for (let i = 0; i < character.length; i++){
            if(character[i].id === attribute){
                if(character[i].value === "0"){
                    diceRoll = "d20";
                    return;
                }
                else{
                    diceRoll = "d20" + character[i].value;
                    return;    
                }
            }
        }
    })
    await interaction.reply("rolling...");
    await setTimeout(editReply, 2000);
    function editReply(){
      interaction.editReply(interaction.options.getString('character') + ", " + attribute + ": " + dice.roll(diceRoll).toString());
    }
},
};