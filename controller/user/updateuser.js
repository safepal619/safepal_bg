// const { validationResult } = require("express-validator");
const User = require("../../model/user");
const { errorHandler } = require("../../utils/error");

module.exports = async (req, res, next) => {
  const { userId } = req.params;

  const {
    avatar,
        username,
        phone_number,
        country,
        street,  
        state,  
        city,  
        zip,  
        kycfront,  
        kycback
  } = req.body


  try {
   

    const user = await User.findByIdAndUpdate(userId, {
        avatar,
        username,
        phone_number,
        country,
        street,  
        state,  
        city,  
        zip,  
        kycfront,  
        kycback
    })

    if(!user) {
      return next(errorHandler(400, "update fail"));
    }

  
    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

