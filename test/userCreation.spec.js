
let Mongo = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
let conf = require('../congif/config');
let User = require('../model/user');
let expect = require('chai').expect;
let assert = require('chai').assert;


describe("UserCreation", ()=>{

let exists = -1;




    User.create("10", "createTest", "create@Test.com", "createTest", function(){}, function(){});

    it('Should find newly created  user in database', ()=>{
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection('users').findOne({nom :"106546546456"}, (err, data) => {
                if(err) throw err;
                exists = (data != null && data !== undefined);
                assert.equal(exists, true);
                db.close();


            });
        });



});



});
