module.exports = {
    name: "ready",
    run: async (client) => {
        console.log(`[BOT]          ${client.user.tag} is running...`);
        client.user.setPresence({
            status: "online",
            activity: {
                name: "Vishnu21",
                type: "WATCHING",
            },
        });

        if (client.spotify) await client.spotify.requestToken();

        const nodes = [...client.manager.nodes.values()];
        for (const node of nodes) {
            try {
                await node.connect();
            } catch (e) {
                client.manager.emit("error", e, node);
            }
        }
    },
};
