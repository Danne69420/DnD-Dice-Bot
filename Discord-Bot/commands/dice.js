const { SlashCommandBuilder } = require('discord.js');

var dice = {
    sides: 6,
    roll: function () {
      var randomNumber = Math.floor(Math.random() * this.sides) + 1;
      return randomNumber;
    }
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll-dice')
		.setDescription('Rolls a six-sided dice'),
	async execute(interaction) {

		await interaction.reply(dice.roll().toString());
	},
};