const mocha = require("mocha"); //This line is useless, mocha works without being required
const assert = require("assert");
const mongoose = require('mongoose');
const TestModel = require("../models/test");
mongoose.Promise = global.Promise;

//Describe Tests
describe("TEST 3: Deleting records", function(){
    let test;
    beforeEach(function(done){

        test = new TestModel({
            title: "Pedro Pantera"
        });

        test.save().then(function(){
            assert(test.isNew === false);
            done();
        });   
    });
    //create tests
    it("Find and remove item by title (Pedro Pantera)", function(done){
        TestModel.findOneAndDelete({title:"Pedro Pantera"}).then(result => {
            return TestModel.findOne({title:"Pedro Pantera"});
        }).then(function(result){
            console.log("Result is " + result);
            assert.equal(result, null);
            done();
        });
    });
});