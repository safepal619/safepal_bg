const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// resend email
const ValidationUser = require("../model/verifyUser");
const { sendSignUpVerifyEmail } = require("../middleware/sendMail");
const { errorHandler } = require("../utils/error");

require("dotenv").config();

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req?.body;

  let loadedUser;
  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg);

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(401, "User not be found"));
    } else {
      loadedUser = user;
    }

    // check of a verify user

    // const isEqual = await bcrypt.compare(password, loadedUser.password);

    if (password !== loadedUser.password) {
      // const error = new Error('Wrong password');
      // error.statusCode = 401
      // throw error

      return next(errorHandler(401, "Wrong password"));
    } else {
      if (!loadedUser.verify_account) {
        await ValidationUser.deleteMany({ userId: loadedUser._id.toString() });
        await sendSignUpVerifyEmail(loadedUser, res, next, (islogin = true));
      } else {
        const token = jwt.sign(
          { email: loadedUser.email, userId: loadedUser._id.toString() },
          process.env.JWT_SIGN,
          { expiresIn: "24h" }
        );

        // const expiredTokenDate = new Date(Date.now() + 3600000);

        // delete loadedUser["_doc"].password;
        const {password, verify_account, __v, 
          createdAt,
          updatedAt,
          ...rest} = loadedUser._doc

          const data = {...rest,token }

        res
          // .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
          .status(200)
          .json({
            message: "Login you successful",
            data: data,
            status: "success"
          });
      }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
