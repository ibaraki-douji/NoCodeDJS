import { ApplicationCommandOptionData, Client } from "discord.js";

export interface DiscordClient extends Client {

}

export interface Datas {
    commands: Array<{
        name: string,
        description: string,
        enabled: boolean,
        options: Array<ApplicationCommandOptionData>,
        response: Array<{
            type: "REPLY" | "MESSAGE" | "DEFER",
            content?: string,
            embed?: string
        }>
    }>;
    modules: {[key: string]: {

    }};
}

export class Imports {
    public readonly fs = require("fs");
}

var imports = new Imports();