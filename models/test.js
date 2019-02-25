const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema and Model
const TestSchema = new Schema({
    title: String,
    age: Number
});

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;