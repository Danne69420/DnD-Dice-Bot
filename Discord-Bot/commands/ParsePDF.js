const { SlashCommandBuilder } = require('discord.js');
const { clientId } = require('C:/Users/daniel.kindvall/Documents/GitHub/DnD-Dice-Bot/Discord-Bot/config.json');
const fs = require('fs'),
PDFParser = require("pdf2json");
const https = require("https");

//This command would be so much better if i properly understood how async functions and promises work. Unfortunately i don't. Too bad!
//The error handling in this command is messy as hell. 
    module.exports = {
        data: new SlashCommandBuilder()
            .setName('parsepdf')
            .setDescription("Temporary test command"),
        async execute(interaction){
            const pdfParser = new PDFParser();

            await interaction.reply("Send the file you want to upload as an attachment. Make sure the name of the file is the same as the name of your character. Remember to @ the bot!");
            // Create a message collector. We collect one message that mentions the bot. 
            const collectorFilter = m => m.mentions.has(clientId);
            const collector = interaction.channel.createMessageCollector({filter: collectorFilter, max: 1, time: 60000 });
            let collectorTimeOut = true;
            //pretty sure this function is absolutely terrible. There is definately a much cleaner and better performing way to do this. 
            await collector.on('collect', m => {
                collectorTimeOut = false;
                console.log("message collected");
                //save the message.attachments object in a json file. This feels like a stupid way to do this but nothing else i've tried has worked.
                fs.writeFile("./PDFs/attachment.json", JSON.stringify(m.attachments), () => { console.log("attachment saved"); });
                //This throws an error if attachment.json does not exist before running the code. 
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
                        //create a file and prepare to write to it
                        const file = fs.createWriteStream(filePath);
                        //fetch our attachment from the internet
                        const request = https.get(attachment[0].url , function(response) {
                            //shove it in the file we made earlier
                            response.pipe(file);
                                     
                            // after download completed close filestream and make a json file from the pdf. Gets rid of the PDF as well, we don't need it
                            file.on("finish", () => {
                                file.close();
                                console.log("Download Completed");
                                //set up event listeners
                                pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
                                pdfParser.on("pdfParser_dataReady", pdfData => {
                                    const newFilePath = filePath.substring(0, filePath.lastIndexOf('.'));
                                    fs.writeFile(newFilePath + ".fields.json", JSON.stringify(pdfParser.getAllFieldsTypes()), ()=>{console.log("Done."); fs.unlink(filePath, ()=>{console.log("pdf deleted");})});
                                });        
                                pdfParser.loadPDF(filePath);        

                            });
                        });    

                        //Need to save the names of saved characters to be able to know wich files to get values from in other commands. Not working.
                        //I have given up on making this work, but it's not breaking anything so i'll leave it in for posterity
                        fs.readFile("./PDFs/savedCharacters.json", "utf-8", (err, jsonString) => {
                            if (err) {
                                console.log("File read failed:", err);
                                return;
                            }        
                            try{
                                const savedCharacters = JSON.parse(jsonString);
                                fs.writeFile("./PDFs/savedCharacters.json", JSON.stringify(savedCharacters + "," + attachment[0].name), ()=>{console.log("savedCharacters.json updated")})    
                            }
                            catch (err) {
                                console.log("Error updating savedCharacters.json", err);
                            }
                        })            
            
                      } catch (err) {
                        console.log("Error parsing JSON string:", err);
                      }

                });
                interaction.editReply("File recieved!");
            });
            collector.on('end', collected =>{
            console.log(`Collected ${collected.size} items`);
            if(collectorTimeOut){
                interaction.editReply("Request timed out, please try again")
            }
            })
        }
    }