const { SlashCommandBuilder } = require('discord.js');
const { clientId } = require('C:/Users/daniel.kindvall/Documents/GitHub/DnD-Dice-Bot/Discord-Bot/config.json');
const fs = require('fs'),
PDFParser = require("pdf2json");
const https = require("https");


    module.exports = {
        data: new SlashCommandBuilder()
            .setName('parsepdf')
            .setDescription("Temporary test command"),
        async execute(interaction){
            const pdfParser = new PDFParser();

            await interaction.reply("Send the file you want to upload as an attachment. Remember to @ the bot!");
            // Create a message collector. We collect one message that mentions the bot. 
            const collectorFilter = m => m.mentions.has(clientId);
            const collector = interaction.channel.createMessageCollector({filter: collectorFilter, max: 1 });
            await collector.on('collect', m => {
                console.log("message collected");
                //save the message.attachments object in a json file.
                fs.writeFile("./PDFs/attachment.json", JSON.stringify(m.attachments), () => { console.log("attachment saved"); });
                fs.readFile("./PDFs/attachment.json", "utf-8", (err, jsonString) => {
                    if (err) {
                        console.log("File read failed:", err);
                        return;
                    }
                    console.log("File data:", jsonString);

                    try {
                        const attachment = JSON.parse(jsonString);
                        const filePath = "./PDFs/" + attachment[0].name;
                        console.log("Url is: " + attachment[0].url);

                        if(attachment[0].contentType !== "application/pdf"){
                            console.log("Error: invalid file format");
                            return;
                        }

                        const file = fs.createWriteStream(filePath);
                        const request = https.get(attachment[0].url , function(response) {
                            response.pipe(file);
                                     
                            // after download completed close filestream
                            file.on("finish", () => {
                                file.close();
                                console.log("Download Completed");

                                pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
                                pdfParser.on("pdfParser_dataReady", pdfData => {
                                    const newFilePath = filePath.substring(0, filePath.lastIndexOf('.'));
                                    fs.writeFile(newFilePath + ".json", JSON.stringify(pdfData), ()=>{console.log("Done.");});
                                });        
                                pdfParser.loadPDF(filePath);        

                            });
                        });    
    
            
                      } catch (err) {
                        console.log("Error parsing JSON string:", err);
                      }

                });
                interaction.editReply("File recieved!");
            });
            collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        }
    }