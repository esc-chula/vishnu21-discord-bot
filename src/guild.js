const { Structures } = require("discord.js");
const Handler = require("./structures/handler");

const Guild = Structures.get("Guild");

class MusicGuild extends Guild {
    constructor(client, data) {
        super(client, data);
        this.music = new Handler(this);
    }
}

Structures.extend("Guild", () => MusicGuild);
