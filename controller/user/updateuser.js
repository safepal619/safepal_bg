const { validationResult } = require("express-validator");
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

  
    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

