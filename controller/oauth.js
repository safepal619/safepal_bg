const { validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.googleAuth = async (req, res, next) => {
  const errors = validationResult(req);

  const { email, userName, account_type, avatar } = req.body;

  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => error.msg);

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }

    const userdata = await User.findOne({ email }).select("-password");


    if (userdata) {
      const token = jwt.sign(
        { email, userId: userdata._id.toString() },
        process.env.JWT_SIGN,
        { expiresIn: "24h" }
      );

     

      const { _v, ...restInfo } = userdata?._doc;
      // _id: id,
      let userData = { ...restInfo };

      res
        // .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
        .status(200)
        .json({
          message: "Login you successful",
          data: userData,
          token,
        });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      const name = userName;

      const data = await User.create({
        username: name,
        password: hashedPassword,
        email,
        account_type,
        phone_number: "08 XXX XXXX",
        verify_account: true,
        avatar
      });

      

      const token = jwt.sign(
        { email: data.email, userId: data._id.toString() },
        process.env.JWT_SIGN,
        { expiresIn: "24h" }
      );

      // const expiredTokenDate = new Date(Date.now() + 3600000);


      const { _v, password, ...restInfo } = data?._doc;

      let userData = { ...restInfo };

      // return res
      //     .cookie("access_token", token, { httpOnly: true, expires: expiredTokenDate })
      res.status(200).json({
        success: true,
        message: "user signup successfully",
        data: userData,
        token,
      });
    }
  } catch (error) {
    next(error);
  }
};
