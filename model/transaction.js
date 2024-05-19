const mongoose = require("mongoose");
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    transactionProof: String,
    sender:{
        type: Schema.Types.ObjectId,
        ref: "user"
      },
    isDeposit: Boolean,
    amount: Number,
    isVerify: {
        type: Boolean,
        default: false
    },
    walletname: String,
    walletId: String,
    logo: String,
    withdrawWalletAddress: String
}, {timestamps: true})

module.exports = mongoose.model('usertransaction', transactionSchema)


