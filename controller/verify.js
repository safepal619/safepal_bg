const { validationResult } = require("express-validator");
const ValidationUser = require("../model/verifyUser");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { sendSignUpVerifyEmail } = require("../middleware/sendMail")

const jwt = require('jsonwebtoken');
const { errorHandler } = require("../utils/error");

require("dotenv").config()

exports.verifyUser = async (req, res, next) => {
    const { userId, token: uniqueString } = req.body

    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const validationErrors = errors.array().map((error) => error.msg);

            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: validationErrors,
            });
        }


        const response = await ValidationUser.findOne({ userId })


        if (!response) {

            return next(errorHandler(401, 'Account record does not exist or has been verify already please signup or login to continue with safepal.'))
        }

        const { expiresAt, uniqueString: hashedUniqueString } = response;
        const data = await User.findOne({ _id: userId }).select("-password")

        if (expiresAt < Date.now()) {

            // // delete user
            // await ValidationUser.deleteOne({ userId })
            // // delete from user table
            // await User.deleteOne({ _id: userId })

            // throw new Error("link has expired. please sign up again.")

            await ValidationUser.deleteOne({ userId })

            await sendSignUpVerifyEmail(data, res, next, islogin = true)

        } else {
            // check the hash key

            const hashResult = bcrypt.compare(uniqueString, hashedUniqueString);

            if (hashResult) {
                // update user verify to true
               const userResponse = await User.findByIdAndUpdate(userId, { verify_account: true })


                // delete user verification record
                await ValidationUser.deleteOne({ userId })


                const token = jwt.sign({ email: data.email, userId: data._id.toString() }, process.env.JWT_SIGN, { expiresIn: '24h' })

                // const expiredTokenDate = new Date(Date.now() + 3600000);

            

                // const { _id: id, _v, ...restInfo } = data?._doc

                // let userData = { ...restInfo }


                const {verify_account, __v, 
                    createdAt,
                    updatedAt,
                    ...rest} = userResponse._doc
          
                    const responsedata = {...rest,token }


                return res
                    // .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
                    .status(200).json({
                        success: true,
                        message: "user is verify successfully",
                        data: responsedata,

                    });
            } else {
                return next(errorHandler(500, 'invalid credentail details passed. please check mail.'))

            }

        }


    } catch (error) {
        next(error)
    }


}