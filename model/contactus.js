const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const contactusSchema = new Schema(
  {
    username: String,
    email: String,
    phone_number: String,
    message: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contacts", contactusSchema);
