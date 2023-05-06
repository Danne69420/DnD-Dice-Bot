const { SlashCommandBuilder } = require('discord.js');
const { clientId } = require('C:/Users/daniel.kindvall/Documents/GitHub/DnD-Dice-Bot/Discord-Bot/config.json');
const fs = require('fs'),
PDFParser = require("pdf2json");



    module.exports = {
        data: new SlashCommandBuilder()
            .setName('parsepdf')
            .setDescription("Temporary test command"),
        async execute(interaction){
            const pdfParser = new PDFParser();

            pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
            pdfParser.on("pdfParser_dataReady", pdfData => {
                fs.writeFile("./PDFs/DnD_5E_CharacterSheet_FormFillable.json", JSON.stringify(pdfData), ()=>{console.log("Done.");});
            });        
            pdfParser.loadPDF("./PDFs/DnD_5E_CharacterSheet_FormFillable.pdf");
            await interaction.reply("Send the file you want to upload as an attachment. Remember to @ the bot!");
            // Create a message collector. We collect one message that mentions the bot. 
            const collectorFilter = m => m.mentions.has(clientId);
            const collector = interaction.channel.createMessageCollector({filter: collectorFilter, max: 1 });
            await collector.on('collect', m => {
                console.log("message collected");
                //save the message.attachments object in a json file.
                fs.writeFile("./PDFs/attachment.json", JSON.stringify(m.attachments), ()=>{console.log("attachment saved")});
                interaction.editReply("File recieved!");
            });
            collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        }
    }