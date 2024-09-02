const express = require("express");
// const AccountInformation = require("../controller/user/accountInformation");

const User = require("../model/user")

const Message = require("../model/messages");
const { errorHandler } = require("../utils/error");


const route = express.Router();


route.post("/", async(req,res, next) => {
    const {from, to, message, status} = req.body
 

    try {
        const data = await Message.create({
            message: {text: message},
            sender: from,
            // receiver: to
            users: [from, to]
        })

        if(data) {

          const user =  await User.findOne({_id: to === "664c99e8421f68f32ee5528c" ? from : to})

          if(to === "664c99e8421f68f32ee5528c") {
              user.message_counter_admin = user.message_counter_admin + 1
              
        } else {
              user.message_counter_user = user.message_counter_user + 1
          }
     
          user.save()



       
            return res.status(200).json({message: "Message sent successfully"})
        }
        return next(errorHandler(500, "message sending failed"))
        
    } catch (error) {
        next(error)
    }

})



route.get("/:from/:to/:status", async(req,res, next) => {
    const {from, to, status} = req.params

//    console.log(req.params)

    try {
        const data = await Message.find({
            // sender: from,
            users: {
                $all: [from, to],
            },

        }).sort({updatedAt: -1}).populate("sender");
 

        if(data) {
            const user =  await User.findOne({_id: to === "664c99e8421f68f32ee5528c" ? from : to})

            console.log(user)

            if(status === "Admin") {
                user.message_counter_admin = 0
                
          } else {
                user.message_counter_user = 0
            }
  
            user.save()
      
    }

        const projectMessages = data.map(mes => {
          
            return {
                fromSelf: mes?.sender?._id.toString() === from ? true : false,
                message: mes?.message?.text,
                _id: mes?._id,
                avatar: mes?.sender?.avatar
            }
        })
     
        res.status(200).json({data: projectMessages})

    } catch (error) {
        console.log(error)
        next(error)
    }

})


module.exports = route;
