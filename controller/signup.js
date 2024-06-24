const User = require("../model/user");
const Notification = require("../model/notification");
const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
const { sendSignUpVerifyEmail } = require("../middleware/sendMail");
const { errorHandler } = require("../utils/error");


exports.signUpUser = async (req, res, next) => {
    const errors = validationResult(req);

    const { username, email, password, phone_number } = req.body;

    try {
        if (!errors.isEmpty()) {
            const validationErrors = errors.array().map((error) => error.msg);
    


            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: validationErrors,
            });
        }


        const phone = phone_number ? phone_number : "08 XXX XXXX"
        const userName = username ? username : email.split("@")[0]

        const userResponse = await new User({ username: userName, password, email, phone_number: phone }).save();


        if (!userResponse) {
            return next(errorHandler(500, "failed to create user try again."));
        }

        await Notification.create({user:userResponse._id, message: "create new account" })

        await sendSignUpVerifyEmail(userResponse, res, next, islogin = false)

    } catch (error) {
        next(error);
    }
};

