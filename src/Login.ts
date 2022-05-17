import { Client, Intents } from "discord.js";
import { Navigation as Nav, Page as NavPage } from "./navigator";
import { Datas, DiscordClient, Imports } from "./Types";
import { Utils } from "./Utils";

var discord: DiscordClient = discord;
var navigation: Nav = navigation;
var Page: typeof NavPage = Page;
var imports: Imports = imports;
var utils: Utils = utils;

export class Login {


    constructor() {}

    public login(token: string, start: boolean = false): void {
        if (discord != undefined) return;
        const datas: Datas = JSON.parse(imports.fs.readFileSync("./data.json", "utf8"));
        discord = new Client({
            intents: Object.values(Intents.FLAGS)
        });
        discord.login(token);
        utils.registerEvents();
        discord.on("ready", async () => {
            localStorage.setItem("token", token);
            document.getElementById("account").querySelector("img").src = discord.user.displayAvatarURL({ dynamic: true, size: 128 });
            document.getElementById("account").querySelectorAll("span")[0].innerHTML = discord.user.username;
            document.getElementById("account").querySelectorAll("span")[1].innerHTML = "#" + discord.user.discriminator;
            document.getElementById("account").style.display = "flex";

            if (!imports.fs.existsSync("./data.json")) {
                imports.fs.writeFileSync("./data.json", JSON.stringify({
                    commands: [],
                    modules: []
                }));
            }

            
            for (let guild of discord.guilds.cache.values()) for (let command of (await guild.commands.fetch()).values()) if (!datas.commands.find(c => c.name == command.name)) await command.delete();
            for (let command of datas.commands) {
                for (let guild of discord.guilds.cache.values()) {
                    guild.commands.create({
                        name: command.name,
                        description: command.description,
                        options: command.options
                    })
                }
            }
            
            document.getElementById('power').style.backgroundColor = 'hsl(139, calc(1 * 47.3%), 43.9%)';
        });

        discord.on("guildCreate", (guild) => {
            for (let command of datas.commands) {
                guild.commands.create({
                    name: command.name,
                    description: command.description,
                    options: command.options
                })
            }
        });

        discord.on("raw", console.log);
        discord.on('debug', console.log);
    }

    public stop() {
        for (let shard of discord.ws.shards.values()) {
            shard['_cleanupConnection']();
            shard['_emitDestroyed']();
            shard['destroy']();
            shard['removeAllListeners']();
        }
        discord.destroy();
        discord = undefined;
        document.getElementById('power').style.backgroundColor = 'hsl(359, calc(1 * 82.6%), 59.4%)';
        console.log("Destroyed");
    }

    public start() {
        this.login(localStorage.getItem("token"));
    }

    public linkEvents(): void {}
}

var login = new Login();