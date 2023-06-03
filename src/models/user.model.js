const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    position: String,
    firstName: String,
    lastName: String,
    nickName: String,
    group: String,
    studentId: String,
    discordId: String,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
