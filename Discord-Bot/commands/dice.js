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
		.setDescription('Rolls a user specified dice')
    .addStringOption( option =>
      option.setName('input')
        .setDescription('the dice to roll (XdX)')
        .setRequired(true))
    .addBooleanOption( option =>
      option.setName('whisper')
      .setDescription('Send privately?')
      .setRequired(false)),
	async execute(interaction) {
    var input = interaction.options.getString('input');
    let ephemeral = interaction.options.getBoolean('whisper');
    console.log("whisper: ", ephemeral);

    await interaction.reply({content: "rolling...", ephemeral: ephemeral});
    await setTimeout(editReply, 2000);
    function editReply(){
      interaction.editReply({content: dice.roll(input).toString(), ephemeral: ephemeral});
    }
},
};