const mongoose = require('mongoose');
const ArtistTestModel = require("./models/artistTest");
const stuff = require("../stuff.js");

mongoose.connect(stuff.dbconnection, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB Connection Started");
}).then(() => {
    mongoose.connection.collections.artistmantests.drop(function(resolve){
        console.log("Artists poo gone");
    });
});
