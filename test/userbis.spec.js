let userBis = require('../model/userbis');
let chai = require('chai');
let expect = require('chai').expect;
let assert = require('chai').assert;

//chai.use(require('chai-http'));

let user, req;

describe("UserBis", function(){

    /*
    describe("New User", function(){

        before(function(){
            user = new userBis(0);
            req = ""; //TODO find way to create test with req / res

            user.prenom = "CECI EST";
            user.nom = "UN TEST";
            user.email = "test.test@gmail.com";
        });


        it("before creating user, user id must be null", function(done){
            expect(user._id).to.be.equal(0);
            done();
        });

        it("Data should be correctly initialized into the object", function(done){
           expect(user.prenom).not.to.be.equal("");
           expect(user.nom).not.to.be.equal("");
           expect(user.email).not.to.be.equal("");
           done();
        });

        it("Trying to compare password on unsaved user should throw an error", function(done){
            expect(function(){user.isCorrectPassword("testPassword", function(){})}).to.throw(Error);
            done();
        });

        it("Trying to change password on unsaved user should throw an error", function(done){
            expect(function(){user.changePassword(req,"testPassword", function(){})}).to.throw(Error);
            done();
        });

        it("Saving user to database without 'password' info should throw an error", function(done){
            let err = false;
            user.saveUser().catch((e)=>{
                err = true;
            }).then(()=>{
                expect(err).to.be.true;
                done();
            });

        });

        describe("Saving User1", function(){
            before(function(){
                user.password = "test";
            });

            it("Should not throw an error", function (done){
                expect(function(){
                    user.saveUser().then((res)=>{
                        done();
                    });
                }).to.not.throw();

            });

            it("Should change _id object", function(done){
                expect(user._id).not.to.be.equal(0);
                done();
            });

            it("Should updated instance variables", function(done){
                expect(user.knownInDatabase).to.be.true;
                expect(user.isUpToDated).to.be.true;
                done();
            });

            it("should delete user", function(done){
                user.deleteUser().then((nbr)=>{
                    expect(nbr).to.be.equal(1);
                    done();
                });

            });

        });


    });

*/
});