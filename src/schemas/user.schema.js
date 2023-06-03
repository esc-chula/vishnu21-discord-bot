const Joi = require("joi");

const userCreateSchema = Joi.object({
    position: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    nickName: Joi.string().required(),
    group: Joi.string().required(),
    studentId: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
    position: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    nickName: Joi.string(),
    group: Joi.string(),
    studentId: Joi.string(),
});

module.exports = {
    userCreateSchema,
    userUpdateSchema,
};
