import { readFileSync } from "fs";
import { Commands } from "./Commands";
import { Login } from "./Login";
import { Stats } from "./Stats";
import { DiscordClient } from "./Types";

var discord: DiscordClient = discord;
var login: Login = login;
var stats: Stats = stats;
var commands: Commands = commands;

export enum Page {
    Stats,
    Commands,
    Modules,
    Settings,
    Login
}

export class Navigation {

    private currentPage: Page;

    public static readonly DEFAULT_PAGE: Page = Page.Commands;

    constructor() {
        window.onload = () => this.setCurrentPage(Navigation.DEFAULT_PAGE);
    }

    public getCurrentPage(): Page {
        return this.currentPage;
    }

    public setCurrentPage(page: Page): void {
        this.currentPage = page;

        if (localStorage.getItem('token') === undefined && page != Page.Login) return this.setCurrentPage(Page.Login);

        const html = readFileSync(__dirname + "/html/" + Page[page] + ".html", "utf8").toString();
        document.getElementById("content").innerHTML = html;
        this.linkEvents();
    }

    public linkEvents(): void {
        document.getElementById("list").innerHTML = "<h1>" + Page[this.currentPage] + "</h1><hr>";


        switch (this.currentPage) {
            case Page.Login:
                login.linkEvents();
                break;
            case Page.Stats:
                stats.linkEvents();
                break;
            case Page.Commands:
                commands.linkEvents();
                break;
            case Page.Settings:
                break;
            case Page.Modules:
                break;
            default:
                break;

        }


    }

}

var navigation = new Navigation();