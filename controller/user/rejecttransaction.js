const UserTransactions = require("../../model/transaction");
// const { validationResult } = require("express-validator");
// const User = require("../../model/user");
const { errorHandler } = require("../../utils/error");

module.exports = async (req, res, next) => {

  const {txnId } = req.body;

  try {
    
    const data = await UserTransactions.findById(txnId)

    data.status = "Rejected"
    data.isVerify = true
    data.save()

    if(data) {
      return res.json({ message: "Transaction rejected successfully " });
    } else {
      return next(errorHandler(403, "could not be rejected try again later."));
    }

   
  } catch (error) {
    next(error);
  }
};
