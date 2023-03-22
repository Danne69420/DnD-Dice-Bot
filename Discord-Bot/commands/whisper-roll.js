//Same as regular dice roll, but only the executer of the command can see the response

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
		.setName('whisper-roll-dice')
		.setDescription('Rolls a six-sided dice, secretly'),
	async execute(interaction) {
        await interaction.reply({ content: "rolling...", ephemeral: true} );
        await setTimeout(dice.roll(), 3000);    
		await interaction.editReply({ content: dice.roll().toString(), ephemeral: true });
	}
};