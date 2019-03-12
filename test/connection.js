const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const stuff = require("../stuff.js");

before(function(done){

    mongoose.connect(stuff.dbconnection, {useNewUrlParser: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("DB Connection Started");
        done();
    });
});

//THIS ONLY WORKS BECAUSE THE OTHER TEST FILES INSTANCE THE TESTS MODEL
beforeEach(function(done){
    //DROP COLLECTION
    mongoose.connection.collections.tests.drop(function(resolve){
        done();
    });
});

