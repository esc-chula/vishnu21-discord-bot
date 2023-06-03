module.exports = {
    name: "guildMemberAdd",
    run: async (client, member) => {
        member.send(
            `สวัสดี ${member} คั้บผมม\n\nสามารถขอรับ Role โดยการพิมพ์รหัสนิสิตของตัวเองส่งมาในแชทนี้ได้เลยนะะ Ex. 6538068821`
        );

        const channel = member.guild.channels.cache.find(
            (ch) => ch.name === "member-log"
        );

        if (!channel) return;

        channel.send(
            `ยินดีต้อนรับ ${member} สู่ดิสคอร์ดค่ายวิษณุฯครั้งที่ 21 🎉\n\nสามารถขอรับ Role ผ่านข้อความที่น้องปูนได้ส่งไปในแชทดิสคอร์ดส่วนตัวได้เลยนะะ`
        );
    },
};