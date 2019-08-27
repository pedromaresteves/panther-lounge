const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema and Model
const UserSchema = new Schema({
    username: String,
    googleId: String
});

const User = mongoose.model("User", UserSchema);

module.exports = User;