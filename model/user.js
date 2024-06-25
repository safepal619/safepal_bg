const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already in used"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    username: {
      type: String,
      required: [true, "Please add user name"],
    },
    phone_number: {
      type: String,
      default: "0X0000000",
    },
    message_counter_admin: {
      type: Number,
      default: 0,
    },
    message_counter_user: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "User",
    },
    verify_account: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      default: "USA",
    },
    street: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    kycfront: {
      type: String,
      default: "",
    },
    kycback: {
      type: String,
      default: "",
    },

    accountdetail: {
      username: {
        type: String,
      default: "",
      },
      bankname: {
        type: String,
      default: "",
      },
      accountnumber: {
        type: String,
        default: "",
      },
      bankbranch: {
        type: String,
      default: "",
      },
      paymentType: {
        type: String,
      default: "Bank Transfer",
      }
    },


    wallet: {
      Tether: {
        fiatbalance: {
          type: Number,
          default: 0
        },
        cryptobalance: {
          type: Number,
          default: 0
        },
        walletname: {
          type: String,
          default: "Tether"
        },
        walletId: {
          type: String,
          default: "TRC20 USDT"
        },
        logo: {
          type: String,
          default: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=024"
        }
      },

      Bitcoin: {
        fiatbalance: {
          type: Number,
          default: 0
        },
        cryptobalance: {
          type: Number,
          default: 0
        },
        walletname: {
          type: String,
          default: "Bitcoin"
        },
        walletId: {
          type: String,
          default: "BTC"
        },
        logo: {
          type: String,
          default: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=024"
        }
      },
      Ethereum: {
        fiatbalance: {
          type: Number,
          default: 0
        },
        cryptobalance: {
          type: Number,
          default: 0
        },
        walletname: {
          type: String,
          default: "Ethereum"
        },
        walletId: {
          type: String,
          default: "ETH"
        },
        logo: {
          type: String,
          default: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024"
        }
      },

      Litecoin: {
        fiatbalance: {
          type: Number,
          default: 0
        },
        cryptobalance: {
          type: Number,
          default: 0
        },
        walletname: {
          type: String,
          default: "Litecoin"
        },
        walletId: {
          type: String,
          default: "LTC"
        },
        logo: {
          type: String,
          default: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=024"
        }
      }

    },
  


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
