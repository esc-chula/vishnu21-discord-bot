const genericRoute = (fn) => {
    return async function (req, res, next) {
        try {
            fn(req, res, next);
        } catch (error) {
            res.status(500).send({ success: false, message: error.message });
        }
    };
};

module.exports = genericRoute;
