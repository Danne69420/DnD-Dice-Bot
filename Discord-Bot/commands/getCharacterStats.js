const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports ={
    data: new SlashCommandBuilder()
        .setName('get-character-stats')
        .setDescription("Fetches the stats of a specified character"),

    async execute(interaction) {
        
    }
}