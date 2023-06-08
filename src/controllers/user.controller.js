const express = require("express");
const genericRoute = require("../middleware");
const validator = require("../validator");
const {
    userCreateSchema,
    userUpdateSchema,
} = require("../schemas/user.schema");
const userServices = require("../services/user.services");
const roleMap = require("../constants/role.json");

const router = express.Router();

router.get(
    "/",
    genericRoute(async (req, res) => {
        console.log("[API]          GET /user");

        const users = await userServices.find();

        if (!users) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        return res.status(200).send({ success: true, users });
    })
);

router.get(
    "/sheets",
    genericRoute(async (req, res) => {
        console.log("[API]          GET /user/sheets");

        const sheetNames = [
            "00 ส่วนกลาง",
            "01 ฝ่ายอำนวยการ 1",
            "02 ฝ่ายอำนวยการ 2",
            "03 ฝ่ายกิจกรรม",
            "04 ฝ่ายดำเนินการ",
        ];

        const users = await Promise.all(
            sheetNames.map(async (sheetName) => {
                const users = await userServices.getSheetsData(sheetName);

                const filteredUsers = users.filter((user) => user.studentId);

                return filteredUsers;
            })
        );

        if (!users) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const filteredUsers = users.flat();

        return res.status(200).send({ success: true, filteredUsers });
    })
);

router.post(
    "/sheets/register",
    genericRoute(async (req, res) => {
        console.log("[API]          POST /user/sheets/register");

        const sheetNames = [
            "00 ส่วนกลาง",
            "01 ฝ่ายอำนวยการ 1",
            "02 ฝ่ายอำนวยการ 2",
            "03 ฝ่ายกิจกรรม",
            "04 ฝ่ายดำเนินการ",
        ];

        const users = await Promise.all(
            sheetNames.map(async (sheetName) => {
                const users = await userServices.getSheetsData(sheetName);

                const filteredUsers = users.filter((user) => user.studentId);

                return filteredUsers;
            })
        );

        if (!users) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const filteredUsers = users.flat();

        const createdUsers = [];

        await Promise.all(
            filteredUsers.map(async (user) => {
                const userExists = await userServices.findByStudentId(
                    user.studentId
                );

                if (!userExists) {
                    await userServices
                        .create({ ...user, discordId: null })
                        .then((createdUser) => {
                            createdUsers.push(createdUser);
                        });
                }
            })
        );

        return res.status(200).send({ success: true, createdUsers });
    })
);

router.get(
    "/sheets/check",
    genericRoute(async (req, res) => {
        console.log("[API]          GET /user/sheets/check");

        const sheetNames = [
            "00 ส่วนกลาง",
            "01 ฝ่ายอำนวยการ 1",
            "02 ฝ่ายอำนวยการ 2",
            "03 ฝ่ายกิจกรรม",
            "04 ฝ่ายดำเนินการ",
        ];

        const users = await Promise.all(
            sheetNames.map(async (sheetName) => {
                const users = await userServices.getSheetsData(sheetName);

                const filteredUsers = users.filter((user) => user.studentId);

                return filteredUsers;
            })
        );

        if (!users) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const filteredUsers = users.flat();

        const inValidUsers = [];

        filteredUsers.forEach((user) => {
            const roleId = roleMap[user.position];

            // console.log(roleId);

            if (!roleId) {
                inValidUsers.push(user);
            }
        });

        return res.status(200).send({ success: true, inValidUsers });
    })
);

router.get(
    "/:studentId",
    genericRoute(async (req, res) => {
        const studentId = req.params.studentId;

        console.log(`[API]          GET /user/${studentId}`);

        const user = await userServices.findByStudentId(studentId);

        if (!user) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        return res.status(200).send({ success: true, user });
    })
);

router.get(
    "/discord/:discordId",
    genericRoute(async (req, res) => {
        const discordId = req.params.discordId;

        console.log(`[API]          GET /user/discord/${discordId}`);

        const user = await userServices.findByDiscordId(discordId);

        if (!user) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        return res.status(200).send({ success: true, user });
    })
);

router.post(
    "/discord/unlink",
    genericRoute(async (req, res) => {
        const { discordId } = req.body;

        console.log(`[API]          POST /user/discord/unlink`);

        const user = await userServices.findByDiscordId(discordId);

        if (!user) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const updatedUser = await userServices.update(user._id, {
            discordId: null,
        });

        if (!updatedUser) {
            return res
                .status(500)
                .send({ success: false, message: "User not updated" });
        }

        return res.status(200).send({ success: true, user: updatedUser });
    })
);

router.post(
    "/",
    validator(userCreateSchema),
    genericRoute(async (req, res) => {
        console.log("[API]          POST /user");

        const { studentId } = req.body;

        const userExists = await userServices.findByStudentId(studentId);

        if (userExists) {
            return res
                .status(400)
                .send({ success: false, message: "User already exists" });
        }

        const user = await userServices.create({
            ...req.body,
            discordId: null,
        });

        if (!user) {
            return res
                .status(500)
                .send({ success: false, message: "User not created" });
        }

        return res.status(200).send({ success: true, user });
    })
);

router.post(
    "/discord/link",
    genericRoute(async (req, res) => {
        const { studentId, discordId } = req.body;

        console.log(`[API]          POST /user/discord/link`);

        const user = await userServices.findByStudentId(studentId);

        if (!user) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const updatedUser = await userServices.update(user._id, {
            discordId,
        });

        if (!updatedUser) {
            return res
                .status(500)
                .send({ success: false, message: "User not updated" });
        }

        return res.status(200).send({ success: true, updatedUser });
    })
);

router.put(
    "/:studentId",
    validator(userUpdateSchema),
    genericRoute(async (req, res) => {
        const studentId = req.params.studentId;

        console.log(`[API]          PUT /user/${studentId}`);

        const user = await userServices.findByStudentId(studentId);

        if (!user) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const updatedUser = await userServices.update(user._id, req.body);

        if (!updatedUser) {
            return res
                .status(500)
                .send({ success: false, message: "User not updated" });
        }

        return res.status(200).send({ success: true, updatedUser });
    })
);

router.delete(
    "/:studentId",
    genericRoute(async (req, res) => {
        const studentId = req.params.studentId;

        console.log(`[API]          DELETE /user/${studentId}`);

        const user = await userServices.findByStudentId(studentId);

        if (!user) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const deletedUser = await userServices.remove(user._id);

        if (!deletedUser) {
            return res
                .status(500)
                .send({ success: false, message: "User not deleted" });
        }

        return res.status(200).send({ success: true, deletedUser });
    })
);

module.exports = router;
