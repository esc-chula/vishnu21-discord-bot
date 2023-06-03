require("dotenv/config");

const MusicClient = require("./structures/client");

const client = new MusicClient({
    disableMentions: "everyone",
});

client.build();
