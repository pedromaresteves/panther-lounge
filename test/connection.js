const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

before(function(done){
    //TODO: HIDE CONNECTION
    mongoose.connect('mongodb://admin:admin123@ds247410.mlab.com:47410/panterloungedb', {useNewUrlParser: true});
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

