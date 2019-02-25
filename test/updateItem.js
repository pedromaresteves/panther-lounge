const mocha = require("mocha"); //This line is useless, mocha works without being required
const assert = require("assert");
const mongoose = require('mongoose');
const TestModel = require("../models/test");
mongoose.Promise = global.Promise;

//Describe Tests
describe("TEST 3: Updating records", function(){
    let test;
    beforeEach(function(done){

        test = new TestModel({
            title: "Pedro Pantera",
            age: 30
        });

        test.save().then(function(){
            assert(test.isNew === false);
            done();
        });   
    });
    //create tests
    it("Find and update an item", function(done){
        TestModel.findOneAndUpdate({_id: test._id}, { title: 'jason bourne' }).then(result => {
            return TestModel.findOne({_id: test._id});
        }).then(result => {
            console.log("Result's title: " + result.title);
            assert.equal("jason bourne", result.title);
            done();
        });
    });
    it("Use update operators: increment age by one", function(done){
        TestModel.update({}, {$inc: {age: 1}}).then(() => {
            return TestModel.findOne({title: "Pedro Pantera"});
        }).then(result => {
            console.log(result.age, "FIND METHOD");
            assert.equal(31, result.age);
            done();
        });
    });
});