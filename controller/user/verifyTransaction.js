const UserTransactions = require("../../model/transaction");
// const { validationResult } = require("express-validator");
const User = require("../../model/user");
const { errorHandler } = require("../../utils/error");

module.exports = async (req, res, next) => {
  const {userId, txnId } = req.body;


  try {
   
    const data = await UserTransactions.findById(txnId)

    const user = await User.findById(userId)

   
    
  
 


    if(data.walletId == "BTC") {
        // user.wallet.Bitcoin.cryptobalance 
        if(data.isDeposit){
          user.wallet.Bitcoin.fiatbalance +=  data.amount
        } else {
          user.wallet.Bitcoin.fiatbalance -=  data.amount
        }

    }


    if( data.walletId == "ETH") {
        // user.wallet.Ethereum.cryptobalance += data.amount
        if(data.isDeposit){
          user.wallet.Ethereum.fiatbalance += data.amount
        } else {
          user.wallet.Ethereum.fiatbalance -= data.amount
        }
    }

if(data.walletId == "LTC") {
    // user.wallet.Litecoin.cryptobalance += data.amount
    if(data.isDeposit){
      user.wallet.Litecoin.fiatbalance += data.amount
    } else {
      user.wallet.Litecoin.fiatbalance -= data.amount
    }
}

if(data.walletId == "TRC20 USDT"){
    // user.wallet.Tether.cryptobalance +=  data.amount
    if(data.isDeposit){
      user.wallet.Tether.fiatbalance += data.amount
    } else {
      user.wallet.Tether.fiatbalance -= data.amount
    }
}





data.isVerify = true
data.status = "Success"

data.save()
user.save()


    if(data) {
      return res.json({ message: "Transaction save successfully " });
    } else {
      return next(errorHandler(403, "could not save try again later."));
    }


   
  } catch (error) {
    next(error);
  }
};
