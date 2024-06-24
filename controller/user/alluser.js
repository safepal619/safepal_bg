
const User = require("../../model/user");
const { errorHandler } = require("../../utils/error");

module.exports = async (req, res, next) => {

  try {
  

    const data = await User.find().sort({updatedAt: -1}).exec()

    if(data) {
      return res.json({ data });
    } else {
      return next(errorHandler(403, " try again later."));
    }


   
  } catch (error) {
    next(error);
  }
};
