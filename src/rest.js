const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userController = require("./controllers/user.controller");

const app = express();
const port = process.env.PORT || 3000;

module.exports = () => {
    mongoose
        .connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.7mwofts.mongodb.net/nongpoon?retryWrites=true&w=majority`
        )
        .then(() => {
            console.log(`[API]          Connected to MongoDB`);
        })
        .catch((err) => {
            console.log(`[API]          Error connecting to MongoDB ${err}`);
        });

    app.use(bodyParser.json());

    app.use("/user", userController);

    app.listen(port, () => {
        console.log(`[API]          API Server is running on port ${port}`);
    });
};
