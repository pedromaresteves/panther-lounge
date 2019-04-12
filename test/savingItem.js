const assert = require("assert");
const mongoose = require('mongoose');
const TestModel = require("../models/test");
mongoose.Promise = global.Promise;

//Describe Tests
describe("TEST 1: Save Records to DB", function(){
    //create tests
    it("Save Pedro Pantera", function(done){
        const test = new TestModel({
            title: "Pedro Pantera"
        });
        test.save().then(function(){
            assert(test.isNew === false);
            done();
        });
    });

});