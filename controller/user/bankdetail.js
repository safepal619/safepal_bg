const { validationResult } = require("express-validator");
const User = require("../../model/user");
const { errorHandler } = require("../../utils/error");

module.exports = async (req, res, next) => {
  const { userId } = req.params;
  const {
    username,
    bankname,
    bankbranch,
    paymentType,
    accountnumber
  } = req.body;


  if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"));

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array()[0].msg;

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        error: validationErrors,
      });
    }

    const data = await User.findByIdAndUpdate(userId, {accountdetail: { 
        username,
        bankname,
        bankbranch,
        paymentType,
        accountnumber
      }})

    if(data) {
      return res.json({ message: "Save successfully " });
    } else {
      return next(errorHandler(403, "could not save try again later."));
    }


   
  } catch (error) {
    next(error);
  }
};
