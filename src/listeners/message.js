const axios = require("axios");
const roleMap = require("../constants/role.json");

const userFound = {};

module.exports = {
    name: "message",
    run: async (client, msg) => {
        // dm message
        if (!msg.guild) {
            if (msg.author.bot) return;

            console.log(`[BOT-DM]       ${msg.author.tag}: ${msg.content}`);

            if (msg.content === "confirm" && userFound[msg.author.id]) {
                await axios
                    .post("http://localhost:7000/user/role", {
                        studentId: userFound[msg.author.id].studentId,
                        discordId: msg.author.id,
                    })
                    .then(async (res) => {
                        console.log(
                            `[API]          ${JSON.stringify(res.data)}`
                        );

                        try {
                            const member = await client.guilds.cache
                                .get(process.env.SERVER_ID)
                                .members.fetch(msg.author.id);

                            const rolesMap =
                                roleMap[userFound[msg.author.id].position];

                            rolesMap.forEach((role) => {
                                member.roles.add(role);
                            });

                            msg.channel.send(
                                `ปูนได้ให้ Role สำหรับ${
                                    userFound[msg.author.id].position
                                } แล้วนะะ\n\nสามารถกลับไปที่ดิสคอร์ดได้เลยค้าบบ`
                            );
                        } catch (error) {
                            console.log(`[BOT-DM]       ${error}`);

                            await axios
                                .post(
                                    `http://localhost:7000/user/discord/${msg.author.id}/unlink`
                                )
                                .then((res) => {
                                    console.log(
                                        `[API]          ${JSON.stringify(
                                            res.data
                                        )}`
                                    );
                                })
                                .catch((err) => {
                                    console.log(
                                        `[API]          ${JSON.stringify(
                                            err.response.data
                                        )}`
                                    );
                                });

                            msg.channel.send(
                                `เกิดข้อผิดพลาดในการเพิ่ม Role \nลองใส่รหัสนิสิตใหม่หรือติดต่อฝ่าย IT ดูนะค้าบบ`
                            );
                        }
                    })
                    .catch(async (err) => {
                        console.log(`[BOT-DM]       ${err}`);

                        msg.channel.send(
                            `เกิดข้อผิดพลาดในการเพิ่ม Role \nลองใส่รหัสนิสิตใหม่หรือติดต่อฝ่าย IT ดูนะค้าบบ`
                        );
                    });

                delete userFound[msg.author.id];

                return;
            } else if (msg.content === "cancel" && userFound[msg.author.id]) {
                msg.channel.send(
                    `ok คับผมม\nสามารถพิมพ์รหัสนิสิตของตัวเองส่งมาใหม่ได้นะ\nหรือถ้าติดปัญหาอะไรก็สามารถติดต่อฝ่าย IT ได้เลยค้าบบ`
                );
                delete userFound[msg.author.id];
                return;
            }

            delete userFound[msg.author.id];

            if (!isNaN(Number(msg.content)) && msg.content.length === 10) {
                const studentIdregex = /^653\d{5}21$/;
                const isStudentIdValid = studentIdregex.test(msg.content);

                if (isStudentIdValid) {
                    const roleGivenUser = await axios
                        .get(
                            `http://localhost:7000/user/discord/${msg.author.id}`
                        )
                        .then((res) => res.data.user)
                        .catch((err) => null);

                    if (roleGivenUser) {
                        msg.channel.send(
                            `ปูนได้ให้ Role กับเพื่อนไปแล้วนะ\nถ้าหากติดปัญหาอะไรติดต่อฝ่าย IT ได้เลยนะ`
                        );

                        return;
                    }

                    msg.channel.send("ขอปูนตรวจสอบเลขนิสิตให้แปปนึงนะ");

                    await axios
                        .get(`http://localhost:7000/user/${msg.content}`)
                        .then(async (res) => {
                            console.log(
                                `[BOT-DM]       Student ID found: ${JSON.stringify(
                                    res.data.user
                                )}`
                            );

                            userFound[msg.author.id] = res.data.user;

                            if (res.data.user.discordId) {
                                msg.channel.send(
                                    `เลขนิสิตนี้ได้ให้ Role ไปแล้วนะ\nถ้าหากติดปัญหาอะไรติดต่อฝ่าย IT ได้เลยนะ`
                                );

                                delete userFound[msg.author.id];

                                return;
                            }

                            msg.channel.send(
                                `ข้อมูลที่ปูนเจอจากเลขนิสิตของเพื่อนคือ\n\nชื่อ: ${
                                    res.data.user.firstName
                                } ${res.data.user.lastName} (${
                                    res.data.user.nickName
                                })\nเลขนิสิต: ${
                                    res.data.user.studentId
                                }\nกรุ๊ป: ${res.data.user.group}\nหน้าที่: ${
                                    res.data.user.position
                                }\n\nถ้าหากข้อมูลถูกต้องพิมคำว่า  "${"**`confirm`**"}"  มาให้หน่อยนะ ถ้าหากไม่ถูกพิมคำว่า  "${"**`cancel`**"}"  มาให้หน่อยนะ`
                            );
                        })
                        .catch(() => {
                            console.log("[BOT-DM]       Student ID not found");

                            msg.channel.send(
                                `เลขนิสิตของเพื่อนเหมือนจะไม่ได้มีตำแหน่งส่วนกลางนะะ\nลองพิมพ์ใหม่อีกครั้งหรือถ้าหากติดปัญหาอะไรติดต่อฝ่าย IT ของค่ายได้เลย`
                            );
                            return;
                        });
                    return;
                } else {
                    msg.channel.send(
                        `เลขนิสิตของไม่ถูกต้องนะ ลองพิมพ์ใหม่อีกครั้งหรือถ้าหากติดปัญหาอะไรติดต่อฝ่าย IT ของค่ายได้เลย`
                    );
                    return;
                }
            } else {
                msg.channel.send(
                    "ถ้าหากว่าอยากให้น้องปูนช่วยอะไรเพิ่มเติมสามารถติดต่อฝ่าย IT ของค่ายได้เลยนะะ"
                );
                return;
            }
        }

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
