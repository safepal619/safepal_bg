const express = require("express");
const AccountInformation = require("../controller/user/accountInformation");

const UserTransactions = require("../controller/user/transactions")
const ContactUs = require("../controller/user/contactUs")
const IndividualTransactions = require("../controller/user/individualtransaction")
const UpdateProfile = require("../controller/user/updateuser")
const UpdateBankDetail = require("../controller/user/bankdetail")




const {
  userDetailValidator,
  userPayOutValidator,
} = require("../validation/user");
const { verifyToken } = require("../utils/verifyUsers");
const route = express.Router();

/**
 * not yet used
 */
// user account information
route.get(
  "/accountInformation/:userId",
  verifyToken,
  userDetailValidator,
  AccountInformation
);


// post user transaction

route.post(
  "/transaction/user/deposit/:userId",
  verifyToken,
  userDetailValidator,
  (req, res, next) => {
    req.body.isDeposit = true;
    next()
  },
  UserTransactions
);

// post user transaction

route.post(
  "/transaction/user/withdraw/:userId",
  verifyToken,
  userDetailValidator,
  (req, res, next) => {
    req.body.isDeposit = false;
    next()
  },
  UserTransactions
);

// get user transaction
route.get(
  "/transaction/user/:userId",
  verifyToken,
  userDetailValidator,
  IndividualTransactions
);

// user update profile
route.patch(
  "/profile/update/:userId",
  verifyToken,
  userDetailValidator,
  UpdateProfile
);

// user update bank detail
route.patch(
  "/bankdetail/update/:userId",
  verifyToken,
  userDetailValidator,
  UpdateBankDetail
);



// post contact-us
route.post(
  "/contact",
  ContactUs 
);








module.exports = route;
