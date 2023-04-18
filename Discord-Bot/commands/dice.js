const { SlashCommandBuilder } = require('discord.js');
//this might be the ugliest code i have ever writtien, but it (mostly) works. 
var dice = {
    roll: function (input) {

      //split at d to seperate number of sides from number of dice
      const diceArgs = input.split("d");
      //split at + to seperate additional bonuses
      const plusArg = diceArgs[1].split("+");

      console.log(plusArg);
      console.log(diceArgs);

      if(diceArgs[1].includes("+")){
        diceArgs[1] = diceArgs[1].replace("+"+ plusArg[1], "");
      }

      //if input is in correct the format (XdX) the array will always have 2 elements. ToDo: somehow check if input format is correct before command is sent. 
      if (diceArgs.length == 2){

        var sides = diceArgs[1];
        var numberOfDice = diceArgs[0];
        var totalResult = 0;
        //if the number of dice is omitted we roll one dice
        if (numberOfDice == 0){
          numberOfDice = 1;
        }
        var individualResults = [];
        for (let i = 0; i < numberOfDice; i++){
          var randomNumber = Math.floor(Math.random() * sides) + 1;
          totalResult += randomNumber;
          individualResults[i] = randomNumber;
        }
        //If there is a bonus we add it to the total
        if(plusArg.length != 1){
          totalResult += parseInt(plusArg[1]);        
        }
        const returnString = new String('input: ' + input + '\n Individual dice results: ' + individualResults.join(" ") + '\n Total: ' + totalResult);
        return returnString;
      }
      else{
        return "Wrong input format"
      }
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