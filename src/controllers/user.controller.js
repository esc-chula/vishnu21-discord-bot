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
    "/:studentId",
    genericRoute(async (req, res) => {
        const studentId = req.params.studentId;

        const user = await userServices.findByStudentId(studentId);

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
        const user = await userServices.create(req.body);

        if (!user) {
            return res
                .status(500)
                .send({ success: false, message: "User not created" });
        }

        return res.status(200).send({ success: true, user });
    })
);

router.put(
    "/:studentId",
    validator(userUpdateSchema),
    genericRoute(async (req, res) => {
        const studentId = req.params.studentId;

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
