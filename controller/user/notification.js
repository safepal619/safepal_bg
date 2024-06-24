const Notification = require("../../model/notification");
const { errorHandler } = require("../../utils/error");

module.exports = async (req, res, next) => {
const {isView} = req.body
 
  try {
    
    // status: "Pending"
    const data = await Notification.find({}).populate("user").sort({createdAt: -1}).exec()

    if(isView) {
          data.forEach(v => {
          v.status = "Success"
          v.save()
          // return v
      
          })

    }

    

    if(data) {
      return res.json({data, message: "Message delivered successfully " });
    } else {
      return next(errorHandler(403, "could not deliver message try again later."));
    }


   
  } catch (error) {
    next(error);
  }
};
