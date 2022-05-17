import { DiscordClient } from "./Types";

var discord: DiscordClient = discord;

export class Stats {
    constructor() {}

    public linkEvents(): void {
        const x = setInterval(() => {
            if (document.getElementById("stats") === null) {
                clearInterval(x);
                return;
            }
            document.getElementById("servers-count").innerHTML = discord.guilds.cache.size+"";
            document.getElementById("users-count").innerHTML = discord.users.cache.size+"";
            document.getElementById("top-servers").innerHTML = [...discord.guilds.cache.values()].sort((a, b) => b.memberCount - a.memberCount).splice(0, 8).map(g => `<div class="top-server"><img src="${g.iconURL({dynamic: true, size: 96})}"><span class="name">${g.name}</span></div>`).join("");
        }, 1000);
    }
}

var stats = new Stats();