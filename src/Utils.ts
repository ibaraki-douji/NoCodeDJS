import { CommandInteraction } from "discord.js";
import { Datas, DiscordClient, Imports } from "./Types";

var discord: DiscordClient = discord;
var imports: Imports = imports;
var contentValue = contentValue;

export class Utils {
    public registerEvents() {
        discord.on('interactionCreate', async (interaction: CommandInteraction) => {
            const datas: Datas = JSON.parse(imports.fs.readFileSync('./data.json', 'utf8'));
    
            if (!interaction.isApplicationCommand()) return;
    
            if (datas.commands.find(c => c.name == interaction.commandName)) {
                for (let actions of datas.commands.find(c => c.name == interaction.commandName).response) {
                    
                    while (actions.content != undefined && actions.content.includes("${") && actions.content.includes("}")) {
                        let start = actions.content.indexOf("${");
                        let end = actions.content.indexOf("}");
                        let key = actions.content.substring(start + 2, end);
                        eval("contentValue = " + key);
                        
                        actions.content = actions.content.replace("${" + key + "}", contentValue);
                    }

                    switch (actions.type) {
                        case "REPLY":
                            if (!interaction.replied) await interaction.reply(actions.content);
                            else await interaction.editReply(actions.content);
                            break;
                        case "MESSAGE":
                            await interaction.channel.send(actions.content);
                            break;
                        case "DEFER":
                            await interaction.deferReply();
                            break;
                    }
                }
                if (!interaction.replied) await interaction.reply({
                    content: "Command executed.",
                    ephemeral: true
                });
            } else {
                await interaction.reply("Command not found");
            }
        });
    }
}

var utils = new Utils();