const express = require("express");
const { signUpUser } = require("../controller/signup");
const { resignup } = require("../controller/resignup");

const { loginUser } = require("../controller/login");
const { verifyUser } = require("../controller/verify");
const { resetPassword } = require("../controller/resetPassword");
const { forgetPassword } = require("../controller/forgetPassword");
const { changePassword } = require("../controller/changePassword");
const resendForgetPassword = require("../controller/resendForgetPassword");

const { registrationValidator,
  loginValidator,
  verifyuserValidator,
  resetPassWordValidator,
  forgetPassWordValidator,
  resendForgetPassWordValidator,
  changePassWordValidator,
  developerRegistrationValidator,
  googleRegistrationValidator
} = require("../validation/user");



const route = express.Router();
// const jwt = require('jsonwebtoken');
const { googleAuth } = require("../controller/oauth");


// signup a user
route.post("/signup", registrationValidator, signUpUser);

// login a user
route.post("/login", loginValidator, loginUser);


// verify user
route.patch("/verify", verifyuserValidator, verifyUser)



// signup a developer
route.post("/developer/signup", developerRegistrationValidator, signUpUser);

// signup a user
route.post("/resignup", resendForgetPassWordValidator, resignup);





// reset password
route.post("/resetPasswordRequest", resetPassWordValidator, resetPassword)

// change password
route.post("/changePasswordRequest/:userId", changePassWordValidator, changePassword)

// forget password
route.post("/forgetPasswordRequest", forgetPassWordValidator, forgetPassword)

// forget password
route.post("/resendForgetPasswordRequest", resendForgetPassWordValidator, resendForgetPassword)


route.post("/google", googleRegistrationValidator, googleAuth)


route.get("/signout", (req, res, next) => {
  try {
    res.clearCookie("access_token")
    res.status(200).json("User successfully logout.")

  } catch (error) {
    next(error)

  }

})






// router.use((req, res, next) => {
//   const token = yourJwtService.getToken(req) // Get your token from the request
//   jwt.verify(token, 'your-secret', function(err, decoded) {
//     if (err) throw new Error(err) // Manage different errors here (Expired, untrusted...)
//     req.auth = decoded // If no error, token info is returned in 'decoded'
//     next()
//   });
// })


module.exports = route;
