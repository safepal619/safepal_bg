const mongoose = require("mongoose");
const Schema = mongoose.Schema

const verifyUserSchema = new Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
})

module.exports = mongoose.model('VerifyUsers', verifyUserSchema)