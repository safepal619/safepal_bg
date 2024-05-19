const User = require("../model/user");
const { validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
const { sendSignUpVerifyEmail } = require("../middleware/sendMail");
const { errorHandler } = require("../utils/error");


exports.signUpUser = async (req, res, next) => {
    const errors = validationResult(req);

    const { username, email, password, phone_number } = req.body;
    // console.log("req.body", req.body)

    try {
        if (!errors.isEmpty()) {
            const validationErrors = errors.array().map((error) => error.msg);
    


            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: validationErrors,
            });
        }



        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 12);

        const phone = phone_number ? phone_number : "08 XXX XXXX"
        const userName = username ? username : email.split("@")[0]



        // const userResponse = await User.create({ username: userName, password, email, phone_number: phone });
        const userResponse = await new User({ username: userName, password, email, phone_number: phone }).save();

        // if (userResponse.account_type == "Project manager") {
        //     await User.findByIdAndUpdate(userResponse._id, { status: "Developer" });
        // }


        if (!userResponse) {
            return next(errorHandler(500, "failed to create user try again."));
        }

        await sendSignUpVerifyEmail(userResponse, res, next, islogin = false)

    } catch (error) {
        next(error);
    }
};

