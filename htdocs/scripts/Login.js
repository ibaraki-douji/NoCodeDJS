"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const discord_js_1 = require("discord.js");
var discord = discord;
var navigation = navigation;
var Page = Page;
var imports = imports;
var utils = utils;
class Login {
    constructor() { }
    login(token, start = false) {
        if (discord != undefined)
            return;
        const datas = JSON.parse(imports.fs.readFileSync("./data.json", "utf8"));
        discord = new discord_js_1.Client({
            intents: Object.values(discord_js_1.Intents.FLAGS)
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
            for (let guild of discord.guilds.cache.values())
                for (let command of (await guild.commands.fetch()).values())
                    if (!datas.commands.find(c => c.name == command.name))
                        await command.delete();
            for (let command of datas.commands) {
                for (let guild of discord.guilds.cache.values()) {
                    guild.commands.create({
                        name: command.name,
                        description: command.description,
                        options: command.options
                    });
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
                });
            }
        });
        discord.on("raw", console.log);
        discord.on('debug', console.log);
    }
    stop() {
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
    start() {
        this.login(localStorage.getItem("token"));
    }
    linkEvents() { }
}
exports.Login = Login;
var login = new Login();
