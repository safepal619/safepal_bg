const mongoose = require("mongoose");
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    message: String,
    user:{
        type: Schema.Types.ObjectId,
        ref: "user"
      },  
    status: {
        type: String,
        default: "Pending"
    },
    
}, {timestamps: true})

module.exports = mongoose.model('notification', notificationSchema)


