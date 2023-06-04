module.exports = {
    name: "guildMemberAdd",
    run: async (client, member) => {
        member.send(
            `สวัสดี ${member} คั้บผมม\n\nสำหรับเพื่อนคนไหนที่มีฝ่ายสามารถขอรับ Role โดยการพิมพ์รหัสนิสิตของตัวเองส่งมาในแชทนี้ได้เลยนะะ Ex. 6538068821\n\nถ้าหากว่าติดปัญหาอะไรสามารถแท็ก @IT มาในดิสคอร์ดได้เลยนะะ`
        );

        const channel = member.guild.channels.cache.find(
            (ch) => ch.name === "welcome"
        );

        if (!channel) return;

        channel.send(
            `ยินดีต้อนรับ ${member} สู่ดิสคอร์ดค่ายวิษณุฯครั้งที่ 21 🎉\n\nสำหรับเพื่อนคนไหนที่มีฝ่ายสามารถขอรับ Role ผ่านข้อความที่ปูนได้ส่งไปในแชทดิสคอร์ดส่วนตัวได้เลยนะะ`
        );
    },
};
