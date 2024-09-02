const mongoose = require("mongoose");
const Schema = mongoose.Schema

const messagesSchema = new Schema({
    message: {
        text: {
            type: String,
        required: true
        }
    },
    users: Array,
    // receiver:{
    //     type: Schema.Types.ObjectId,
    //     ref: "user",
    //     required: true
    //   },  
    sender:{
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
      },  
    
}, {timestamps: true})

module.exports = mongoose.model("messages", messagesSchema)
