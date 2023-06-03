const Joi = require("joi");

module.exports = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
        res.status(400).send({ success: false, error: error.message });
    } else {
        res.locals.body = value;
        next();
    }
};
