const mocha = require("mocha"); //This line is useless, mocha works without being required
const assert = require("assert");
const mongoose = require('mongoose');
const ArtistTestModel = require("../models/artistTest");
mongoose.Promise = global.Promise;

//Describe Tests
describe("TEST 4: Nesting records", function(){
    let pedroPantera;
    let panteraDoNatalPassado = {
        title: "Pantera do Natal Passado",
        lyricsChords:`<div class='song'><p>
        <span class='chord'>G</span>&emsp;&emsp;&emsp;&emsp;<span class='chord'>C</span>&emsp;&emsp;&emsp;<span class='chord'>G</span>&emsp;&emsp;&emsp;&emsp;<span class='chord'>C</span>
        Acordei saio da cama, vou á janela
        <span class='chord'>G</span>&emsp;&emsp;&emsp;<span class='chord'>C</span>&emsp;&emsp;&emsp;<span class='chord'>G</span>&emsp;&emsp;&emsp;<span class='chord'>C</span>
        Está tanto frio, mas é um dia bonito, vou desfrutar
        <span class='chord'>G</span>&emsp;&emsp;&emsp;<span class='chord'>C</span>&emsp;&emsp;&emsp;<span class='chord'>G</span>&emsp;&emsp;&emsp;<span class='chord'>C</span>
        Vejo a senhora matos com sua camisa de flanela
        <span class='chord'>G</span>&emsp;&emsp;&emsp;<span class='chord'>C</span>&emsp;&emsp;&emsp;<span class='chord'>G</span>&emsp;&emsp;&emsp;<span class='chord'>C</span>
        Bom dia senhora matos, ela não ouviu e continuar a caminhar<p>
        </div>`
    };

    let wavesOfInformation = {
        title: "Waves of Information",
        lyricsChords:`IT'S THEM WAVES OF INFORMATION`
    };

    let todoTerrenoDesportivo = {
        title: "Todo Terreno Desportivo",
        lyricsChords:`Olá sou o Quim`
    };
    //create tests
    it("Save a record with nested documents", function(done){
        let pedroPantera = new ArtistTestModel({
            title: "Pedro Pantera",         
            songs: [panteraDoNatalPassado]
        });

        pedroPantera.save().then(function(){
            assert(pedroPantera.isNew === false);
            return ArtistTestModel.findOne({title: "Pedro Pantera"})
        }).then(result => {
            assert(result.songs.length > 0);
            done();
        });   
        
    });

    it("Add book to an existing Artist", function(done){
        let theFiveDrakes = new ArtistTestModel({
            title: "The Five Drakes",         
            songs: [wavesOfInformation]
        });
        theFiveDrakes.save().then(() => {
            return ArtistTestModel.findOne({title: "The Five Drakes"})
        }).then(result => {
            result.songs.push(todoTerrenoDesportivo);
            return result.save();
        }).then(()=>{
            return ArtistTestModel.findOne({title: "The Five Drakes"})
        }).then(result => {
            console.log(result.songs, "DICK MAN");
            assert(result.songs.length > 1);
            done();
        });
    });
});