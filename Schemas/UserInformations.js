const {Schema, model} = require("mongoose");

const UserInformationSchema = new Schema({
    Username : String,
    Email : String,
    Password : String,
    Birthday : String,
    Admin : Boolean,
});

module.exports = model("UserInformationSchema", UserInformationSchema)