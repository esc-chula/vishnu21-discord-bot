module.exports = {
    name: "voiceStateUpdate",
    run: async (client, oldState, newState) => {
        if (!newState.member) await newState.guild.members.fetch(newState.id);

        const {
            guild: { music },
        } = newState;
        if (
            newState.member.user.equals(client.user) &&
            !newState.channel &&
            music.player
        ) {
            if (music.player.playing) await music.stop();
            if (music.player) await client.manager.leave(music.guild.id);
        }
    },
};
