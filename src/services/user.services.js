const UserModel = require("../models/user.model");

const create = async (user) => {
    const createdUser = await UserModel.create(user)
        .then((createdUser) => createdUser)
        .catch(() => null);

    return createdUser;
};

const find = async () => {
    const users = await UserModel.find()
        .then((users) => users)
        .catch(() => null);

    return users;
};

const findByStudentId = async (studentId) => {
    const user = await UserModel.findOne({ studentId })
        .then((user) => user)
        .catch(() => null);

    return user;
};

const findByDiscordId = async (discordId) => {
    const user = await UserModel.findOne({ discordId })
        .then((user) => user)
        .catch(() => null);

    return user;
};

const update = async (id, user) => {
    const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
        new: true,
    })
        .then((updatedUser) => updatedUser)
        .catch(() => null);

    return updatedUser;
};

const remove = async (id) => {
    const deletedUser = await UserModel.findByIdAndDelete(id)
        .then((deletedUser) => deletedUser)
        .catch(() => null);

    return deletedUser;
};

module.exports = {
    create,
    find,
    findByStudentId,
    findByDiscordId,
    update,
    remove,
};
