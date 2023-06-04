const axios = require("axios");
const UserModel = require("../models/user.model");

const getSheetsData = async (sheetName) => {
    const scriptUrl = process.env.SHEETS_SCRIPT_URL;

    const sheetData = axios
        .post(`${scriptUrl}?action=getUsers`, {
            sheetName,
        })
        .then((sheetData) => sheetData.data)
        .catch(() => null);

    return sheetData;
};

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
    getSheetsData,
    create,
    find,
    findByStudentId,
    findByDiscordId,
    update,
    remove,
};
