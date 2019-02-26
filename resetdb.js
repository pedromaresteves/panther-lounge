const mongoose = require('mongoose');
const ArtistTestModel = require("./models/artistTest");
//TODO: HIDE CONNECTION
mongoose.connect('mongodb://admin:admin123@ds247410.mlab.com:47410/panterloungedb', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB Connection Started");
}).then(() => {
    mongoose.connection.collections.artistmantests.drop(function(resolve){
        console.log("Artists poo gone");
    });
});
