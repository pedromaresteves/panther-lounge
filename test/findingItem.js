const mocha = require("mocha"); //This line is useless, mocha works without being required
const assert = require("assert");
const mongoose = require('mongoose');
const TestModel = require("../models/test");
mongoose.Promise = global.Promise;

//Describe Tests
describe("TEST 2: Finding records", function(){
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
    it("Find item by title (Pedro Pantera)", function(done){
        TestModel.findOne({title:"Pedro Pantera"}).then(result => {
            console.log(result);
            assert(result.title === "Pedro Pantera");
            done();
        });
    });

    it("Find item by ID", function(done){
        TestModel.findOne({_id: test._id}).then(result => { //When using find method, it's not necessary to .toString()
            console.log("RESULTS BY ID:",result._id.toString(), test._id.toString());
            assert.strictEqual(result._id.toString(), test._id.toString()); //We have to convert to String to compare
            done();
        });
    });
});