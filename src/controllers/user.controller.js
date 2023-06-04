const express = require("express");
const genericRoute = require("../middleware");
const validator = require("../validator");
const {
    userCreateSchema,
    userUpdateSchema,
} = require("../schemas/user.schema");
const userServices = require("../services/user.services");

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

router.post(
    "/sheets",
    genericRoute(async (req, res) => {
        console.log("[API]          POST /sheets");

        const { sheetName } = req.body;

        const users = await userServices.getSheetsData(sheetName);

        const filteredUsers = users.filter((user) => user.studentId);

        if (!users) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        return res.status(200).send({ success: true, filteredUsers });
    })
);

router.get(
    "/sheets/register",
    genericRoute(async (req, res) => {
        console.log("[API]          POST /sheets/register");

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

        const filteredUsers = users.flat();

        if (!users) {
            return res
                .status(404)
                .send({ success: false, message: "User not found" });
        }

        const createdUsers = [];

        await Promise.all(
            filteredUsers.map(async (user) => {
                const userExists = await userServices.findByStudentId(
                    user.studentId
                );

                if (!userExists) {
                    await userServices.create(user).then((createdUser) => {
                        createdUsers.push(createdUser);
                    });
                }
            })
        );

        return res.status(200).send({ success: true, createdUsers });
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

        const user = await userServices.create(req.body);

        if (!user) {
            return res
                .status(500)
                .send({ success: false, message: "User not created" });
        }

        return res.status(200).send({ success: true, user });
    })
);

router.post(
    "/role",
    genericRoute(async (req, res) => {
        const { studentId, discordId } = req.body;

        console.log(`[API]          POST /user/role/${studentId}`);

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
