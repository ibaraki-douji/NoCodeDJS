import { Navigation } from "./navigator";
import { Datas, DiscordClient, Imports } from "./Types";

var navigation: Navigation = navigation;
var imports: Imports = imports;
var discord: DiscordClient = discord;

export class Commands {

    private currentCommand: number = 0;
    private readonly commandType = 'SUB_COMMAND\nSUB_COMMAND_GROUP\nSTRING\nINTEGER\nBOOLEAN\nUSER\nCHANNEL\nROLE\nMENTIONABLE\nNUMBER'.split('\n');
    private readonly responseType = 'REPLY\nMESSAGE\nDEFER'.split('\n');
    private readonly channelType = 'GUILD_TEXT\nDM\nGUILD_VOICE\nGROUP_DM\nGUILD_CATEGORY\nGUILD_NEWS\nGUILD_STORE\nGUILD_NEWS_THREAD\nGUILD_PUBLIC_THREAD\nGUILD_PRIVATE_THREAD\nGUILD_STAGE_VOICE\nUNKNOWN'.split('\n');

    constructor() {}

    public createDefault() {
        const data: Datas = JSON.parse(imports.fs.readFileSync("./data.json").toString());
        if (data.commands.find(e => e.name.toLowerCase() == "new command")) return;
        data.commands.push({
            name: "newcommand",
            description: "new command description",
            enabled: false,
            options: [],
            response: []
        });
        imports.fs.writeFileSync("./data.json", JSON.stringify(data));
        navigation.linkEvents();
        this.loadCommand("newcommand");
    }

    public loadCommand(index: number): void;
    public loadCommand(name: string): void;
    public loadCommand(i: string | number) {
        const data: Datas = JSON.parse(imports.fs.readFileSync("./data.json").toString());
        const command = typeof i == "number" ? data.commands[i] : data.commands.find(c => c.name.toLowerCase() == i.toLowerCase());
        if (!command && i === 0) this.createDefault();
        if (!command) return this.loadCommand(0);
        this.currentCommand = data.commands.indexOf(command);
        (document.getElementById("command-name") as HTMLInputElement).value = command.name;
        (document.getElementById("command-desc") as HTMLInputElement).value = command.description;
        const options = document.getElementById("options");
        options.innerHTML = "";
        for (let opt of command.options) {
            options.innerHTML += `
            <div class="card">
            <input type="text" placeholder="option name" value="${opt.name}">
            <input type="text" placeholder="option description" value="${opt.description}">
            <select onchange="commands.updateOptionCard(this)">
                ${this.commandType.map(t => `<option value="${t}" ${(opt.type == t ? "selected" : "")}>${t}</option>`).join("")}
            </select>
            </div>
            `;
        }
        const responses = document.getElementById("actions");
        responses.innerHTML = "";
        for (let resp of command.response) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <select onchange="commands.updateResponseCard(this)">
                ${this.responseType.map(t => `<option value="${t}" ${(resp.type == t ? "selected" : "")}>${t}</option>`).join("")}
            </select>
            ${resp.type == "REPLY" ? `<input type="text" placeholder="message">` : ""}
            ${resp.type == "MESSAGE" ? `<input type="text" placeholder="message">` : ""}
            `;

            switch (resp.type) {
                case "REPLY":
                    (card.children[1] as HTMLInputElement).value = resp.content;
                    break;
                case "MESSAGE":
                    (card.children[1] as HTMLInputElement).value = resp.content;
                    break;
            }

            responses.appendChild(card);
        }
    }

    public updateOptionCard(e: HTMLSelectElement) {
        const val = e.value+"";
        const i = [...e.parentElement.parentElement.children].indexOf(e.parentElement);
        switch (e.value) {
            case "CHANNEL":
                e.parentElement.innerHTML += `
                <select>
                    ${this.channelType.map(c => `<option value="${c}">${c}</option>`).join("")}
                </select>
                `;
                break;
            default:
                if (e.parentElement.children.length > 3) e.parentElement.removeChild([...e.parentElement.children].pop());
                break;
        }

        ([...document.getElementById("options").children][i].children.item(2) as HTMLSelectElement).value = val;
    }

    public deleteCommand() {
        const data: Datas = JSON.parse(imports.fs.readFileSync("./data.json").toString());
        const command = data.commands.splice(this.currentCommand, 1)[0];
        imports.fs.writeFileSync("./data.json", JSON.stringify(data));
        navigation.linkEvents();
        for (let guild of discord.guilds.cache.values()) guild.commands.cache.find(e => e.name === command.name).delete();
    }

    public addOption(): void {
        const options = document.getElementById("options");
        for (let opt of (options as HTMLDivElement).children) {
            if ((opt.children[0] as HTMLInputElement).value == "newoption") return; 
        }
        options.innerHTML += `
        <div class="card">
        <input type="text" placeholder="option name" value="newoption">
        <input type="text" placeholder="option description" value="default description">
        <select onchange="commands.updateOptionCard(this)">
            ${this.commandType.map(t => `<option value="${t}" ${("STRING" == t ? "selected" : "")}>${t}</option>`).join("")}
        </select>
        </div>
        `;
    }

    public addResponse(): void {
        
        const responses = document.getElementById("actions");
        responses.innerHTML += `
        <div class="card">
        <select onchange="commands.updateResponseCard(this)">
            ${this.responseType.map(t => `<option value="${t}">${t}</option>`).join("")}
        </select>
        </div>
        `;
    }

    public updateResponseCard(e: HTMLSelectElement) {
        const val = e.value+"";
        const i = [...e.parentElement.parentElement.children].indexOf(e.parentElement);
        while (e.parentElement.children.length > 1) e.parentElement.removeChild([...e.parentElement.children].pop());
        switch (e.value) {
            case "MESSAGE":
            case "REPLY":
                e.parentElement.innerHTML += `
                <input type="text" placeholder="response content">
                `;
                break;
        }
        ([...document.getElementById("actions").children][i].children.item(0) as HTMLSelectElement).value = val;
    }

    public saveCommand(): void {
        const data: Datas = JSON.parse(imports.fs.readFileSync("./data.json").toString());
        const command = data.commands[this.currentCommand];
        command.name = (document.getElementById("command-name") as HTMLInputElement).value;
        command.description = (document.getElementById("command-desc") as HTMLInputElement).value;
        command.options = [];
        for (let opt of (document.getElementById("options") as HTMLDivElement).children) {
            command.options.push({
                name: (opt.children[0] as HTMLInputElement).value || "newoption",
                type: (opt.children[2] as HTMLSelectElement).value as any,
                description: (opt.children[1] as HTMLInputElement).value || "default description"
            });
        }

        command.response = [];
        for (let resp of (document.getElementById("actions") as HTMLDivElement).children) {
            command.response.push({
                type: (resp.children[0] as HTMLSelectElement).value as any,
                content: (resp.children[1] as HTMLInputElement).value
            });
        }

        if (discord) {
            for (let guild of discord.guilds.cache.values()) guild.commands.create({
                name: command.name,
                description: command.description,
                options: command.options
            })
        }


        imports.fs.writeFileSync("./data.json", JSON.stringify(data));
        navigation.linkEvents();
    }

    public linkEvents(): void {
        document.getElementById("list").innerHTML += (JSON.parse(imports.fs.readFileSync("./data.json").toString()) as Datas).commands.map(c => `<span class="name" onclick="commands.loadCommand('${c.name}')">${c.name}</span>`).join("");
        document.getElementById("list").innerHTML += '<span onclick="commands.createDefault()"><svg height="12" viewBox="0 0 12 12" width="12"><g fill="none" fill-rule="evenodd"><g><path d="m0 0h11v11h-11z"/><path d="m5.95833333 3.20833333h-.91666666v1.83333334h-1.83333334v.91666666h1.83333334v1.83333334h.91666666v-1.83333334h1.83333334v-.91666666h-1.83333334zm-.45833333-2.29166666c-2.53 0-4.58333333 2.05333333-4.58333333 4.58333333s2.05333333 4.5833333 4.58333333 4.5833333 4.5833333-2.0533333 4.5833333-4.5833333-2.0533333-4.58333333-4.5833333-4.58333333zm0 8.25c-2.02125 0-3.66666667-1.64541667-3.66666667-3.66666667s1.64541667-3.66666667 3.66666667-3.66666667 3.66666667 1.64541667 3.66666667 3.66666667-1.64541667 3.66666667-3.66666667 3.66666667z" fill="#3ba55c" fill-rule="nonzero"/></g><path d="m0 0h24v24h-24z"/></g></svg></span>';
        this.loadCommand(this.currentCommand);
    }
}

var commands = new Commands();