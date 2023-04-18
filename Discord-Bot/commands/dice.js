const { SlashCommandBuilder } = require('discord.js');
//https://www.npmjs.com/package/@dice-roller/rpg-dice-roller?activeTab=readme
const rpgDiceRoller = require('@dice-roller/rpg-dice-roller');
var dice = {
    roll: function (input) {


      const roll = new rpgDiceRoller.DiceRoll(input);
      return roll.output;
    }
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll-dice')
		.setDescription('Rolls a six-sided dice')
    .addStringOption( option =>
      option.setName('input')
        .setDescription('the dice to roll (XdX)')
        .setRequired(true)),
	async execute(interaction) {
    var input = interaction.options.getString('input');

    await interaction.reply("rolling...");
    await setTimeout(editReply, 2000);
    function editReply(){
      interaction.editReply(dice.roll(input).toString());
    }
},
};