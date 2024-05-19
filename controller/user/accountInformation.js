const { validationResult } = require("express-validator");
const User = require("../../model/user");
const { errorHandler } = require("../../utils/error");
const axios = require('axios');

module.exports = async (req, res, next) => {
  const { userId } = req.params;


  if (userId !== req?.user?.userId) next(errorHandler(403, "route forbidden"));

  const errors = validationResult(req);


  // const cryptoApiHeader={
  //   'X-RapidAPI-Key': '7d3fe17c69msh049c275c93b3332p1a3673jsn70feed33cb25',
  //   'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
  
  // }

  const options = {
    method: 'GET',
    url: 'https://coinranking1.p.rapidapi.com/coins',
    params: {
      referenceCurrencyUuid: 'yhjMzLPhuIDl',
      timePeriod: '24h',
      'tiers[0]': '1',
      orderBy: 'marketCap',
      orderDirection: 'desc',
      limit: '100',
      offset: '0'
    },
    headers: {
      'X-RapidAPI-Key': '7d3fe17c69msh049c275c93b3332p1a3673jsn70feed33cb25',
      'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
    }
  };
  


  try {
    if (!errors.isEmpty()) {
      const validationErrors = errors.array()[0].msg;

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        error: validationErrors,
      });
    }

    const user = await User.findById(userId).select("-password")

    const btcBalance = user.wallet.Bitcoin.fiatbalance;
    const ethBalance = user.wallet.Ethereum.fiatbalance;
    const ltcBalance = user.wallet.Litecoin.fiatbalance;
    const usdtBalance = user.wallet.Tether.fiatbalance;

    const totalBalance = btcBalance + ethBalance + ltcBalance + usdtBalance;

    

    const response = await axios.request(options);


let BitcoinValue = {
  change: "1.63",
  price: "69692.26433170341"
}

let EthereumValue = {
  change: "0.63",
  price: "3497.9594806180216"
}

let USDTValue = {
  change: "0.63",
      price: "1"
}

let LTCValue = {
  change: "1.63",
      price: "96.261"
}



    const Bitcoin = await [...response?.data?.data?.coins]?.find(v => v.name == "Bitcoin")
        const Ethereum = await [...response?.data?.data?.coins]?.find(v => v.name == "Ethereum")
        const USDT = await [...response?.data?.data?.coins]?.find(v => v.symbol == "USDT")
        const LTC = await [...response?.data?.data?.coins]?.find(v => v.symbol == "LTC")

 
        if (Bitcoin) {
          BitcoinValue = {
                change: Bitcoin.change,
                price: +Bitcoin.price
            }
        }
        if (Ethereum) {
          EthereumValue = {
                change: Ethereum.change,
                price: +Ethereum.price
            }
        }
        if (USDT) {
          USDTValue = {
                change: USDT.change,
                price: +USDT.price
            }
        }
        if (LTC) {
          LTCValue = {
                change: LTC.change,
                price: +LTC.price
            }
        }

        const data = {...user._doc, totalBalance, liveCryptoUpdate: {Bitcoin:BitcoinValue, Ethereum:EthereumValue, USDT:USDTValue, LTC:LTCValue}}
  
  
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

