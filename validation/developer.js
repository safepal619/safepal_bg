const { body, param } = require("express-validator");


exports.developerInfoValidator = [
    param("userId").trim().notEmpty().withMessage("userId not found")
]