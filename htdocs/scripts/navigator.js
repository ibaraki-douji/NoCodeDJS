"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = exports.Page = void 0;
const fs_1 = require("fs");
var discord = discord;
var login = login;
var stats = stats;
var commands = commands;
var Page;
(function (Page) {
    Page[Page["Stats"] = 0] = "Stats";
    Page[Page["Commands"] = 1] = "Commands";
    Page[Page["Modules"] = 2] = "Modules";
    Page[Page["Settings"] = 3] = "Settings";
    Page[Page["Login"] = 4] = "Login";
})(Page = exports.Page || (exports.Page = {}));
class Navigation {
    currentPage;
    static DEFAULT_PAGE = Page.Commands;
    constructor() {
        window.onload = () => this.setCurrentPage(Navigation.DEFAULT_PAGE);
    }
    getCurrentPage() {
        return this.currentPage;
    }
    setCurrentPage(page) {
        this.currentPage = page;
        if (localStorage.getItem('token') === undefined && page != Page.Login)
            return this.setCurrentPage(Page.Login);
        const html = (0, fs_1.readFileSync)(__dirname + "/html/" + Page[page] + ".html", "utf8").toString();
        document.getElementById("content").innerHTML = html;
        this.linkEvents();
    }
    linkEvents() {
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
exports.Navigation = Navigation;
var navigation = new Navigation();
