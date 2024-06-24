const UserTransactions = require("../../model/transaction");
// const { validationResult } = require("express-validator");
// const User = require("../../model/user");
const { errorHandler } = require("../../utils/error");

module.exports = async (req, res, next) => {
//   const { userId } = req.params;
 
//   if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"));

//   const errors = validationResult(req);



  try {
    // if (!errors.isEmpty()) {
    //   const validationErrors = errors.array()[0].msg;

    //   return res.status(400).json({
    //     success: false,
    //     message: "Validation errors",
    //     error: validationErrors,
    //   });
    // }
    // query.sort({ field: 'asc', test: -1 });
    const data = await UserTransactions.find().sort({createdAt: -1}).populate("sender")



    if(data) {
      return res.json({ data });
    } else {
      return next(errorHandler(403, "could not save try again later."));
    }


   
  } catch (error) {
    next(error);
  }
};
