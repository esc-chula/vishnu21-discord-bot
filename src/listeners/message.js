module.exports = {
    name: "message",
    run: async (client, msg) => {
        // dm message
        // if (!msg.guild) {
        //     if (msg.author.bot) return;

        //     console.log(`[BOT-DM]       ${msg.author.tag}: ${msg.content}`);

        //     if (!isNaN(Number(msg.content)) && msg.content.length === 10) {
        //         const studentIdregex = /^653\d{5}21$/;
        //         const isStudentIdValid = studentIdregex.test(msg.content);

        //         if (isStudentIdValid) {
        //             msg.channel.send("ขอน้องปูนตรวจสอบเลขนิสิตให้แปปนึงนะ...");
        //             // call api
        //             return;
        //         } else {
        //             msg.channel.send(
        //                 `เลขนิสิตของไม่ถูกต้องนะ ลองพิมพ์ใหม่อีกครั้งหรือถ้าหากติดปัญหาอะไรติดต่อฝ่าย IT ของค่ายได้เลย`
        //             );
        //             return;
        //         }
        //     } else {
        //         msg.channel.send(
        //             "ถ้าหากว่าอยากให้น้องปูนช่วยอะไรเพิ่มเติมสามารถติดต่อฝ่าย IT ของค่ายได้เลยนะะ"
        //         );
        //         return;
        //     }
        // }

        // server message
        if (!msg.guild) return;
        if (msg.author.bot) return;

        const prefix = msg.content.toLowerCase().startsWith(client.prefix)
            ? client.prefix
            : `<@!${client.user.id}>`;
        if (!msg.content.toLowerCase().startsWith(prefix)) return;

        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (c) => c.aliases && c.aliases.includes(commandName)
            );

        console.log(`[BOT-SERVER]   ${msg.author.tag} used ${commandName}`);

        if (command) {
            try {
                await command.run(msg, args);
            } catch (e) {
                console.error(e);
            }
        }
    },
};
