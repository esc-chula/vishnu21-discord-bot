const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

module.exports = () => {
    app.use(bodyParser.json());

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.listen(port, () => {
        console.log(`[API]          API Server is running on port ${port}`);
    });
};
