const { SlashCommandBuilder } = require('discord.js');

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
            await interaction.reply("Working!");
        }
    }