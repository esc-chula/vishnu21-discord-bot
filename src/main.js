require("dotenv/config");

const apiServer = require("./rest");
const MusicClient = require("./structures/client");
const client = new MusicClient({
    disableMentions: "everyone",
});

apiServer();

client.build();
