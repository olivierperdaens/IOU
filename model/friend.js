let conf = require('../congif/config');
let Mongo = require('mongodb');
let MongoClient = Mongo.MongoClient;
let Server = require('mongodb').Server;
let user = require('../model/user');
let auth = require('../model/auth');
let debt = require("../model/debt");


class Friend{

    constructor(oid, callback){
        this._id = oid;
        this.loadData(callback);

    }

    loadData(callback){
        let self = this;
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db("iou");
            dbo.collection("friends").findOne({_id:Mongo.ObjectId(this._id)}, (err, data) => {
                if(err) throw err;
               if(data != null && data !== undefined){
                   self._confirmed = data.confirmed;
                   self._askDate = data.askDate;
                   self._id_asker = data.id_asker;
                   self._id_recever = data.id_recever;
                   callback(self);
               }
            });
        });
    }

    getAsker(cb){
        MongoClient.connect(conf.db.url, (err, db) => {
           if(err) throw err;
           let dbo = db.db("iou");
           dbo.collection("users").findOne({_id : Mongo.ObjectId(this._id_asker)}, (err, res)=>{
              if(err) throw err;
              cb(res);
           });
        });
       /*
        new user(this.id_asker, function(user1){
            cb(user1);
        });
        */
    }

    getRecever(cb){
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db("iou");
            dbo.collection("users").findOne({_id : Mongo.ObjectId(this._id_recever)}, (err, res)=>{
                if(err) throw err;
                cb(res);
            });
        });
        /*
        new user(this.id_recever, function(user2){
            cb(user2);
        });
        */
    }

    /**
     * cb renvoie pas une instance du user ! juste les donées
     * @param cb
     */
    async getOtherUser(cb){
        if(conf.connectedUser.id === this._id_asker){
            this.getRecever(function(user){
                cb(user);
            });
        }
        else{
            this.getAsker(function(user){
               cb(user);
            });
        }
    }

    get confirmed(){
        return this._confirmed;
    }

    get askDate(){
        return this._askDate;
    }

    static getAllFriendAsks(cb){
        let list = [];
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection("friends").find({id_recever: conf.connectedUser.id.toString(), confirmed: false}).toArray((err, res)=>{
                if(err) throw err;
                let i=0;
                res.forEach(function(fri){
                   i++;
                   new Friend(fri._id, function(friend){
                       list.push(friend);
                       if(i===res.length){
                           cb(list);
                           db.close();
                       }
                   })
                });
                if(res.length ===0){
                    cb(list);
                    db.close();
                }
            });
        });
    }

    static refuse(idFriend, cbSuccess, cbError){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            if (err) throw err;
            let dbo = db.db("iou");
            dbo.collection("friends").findOne({id_asker : idFriend.toString()}, function(err, data){
                if(err) throw err;
                if(data.length !== 0){
                    dbo.collection("friends").deleteOne({_id : Mongo.ObjectId(data._id)}, function(err, data2){
                        if(err) throw err;
                        if(data2.deletedCount === 1){
                            db.close();
                            cbSuccess();
                        }
                        else{
                            db.close();
                            cbError();
                        }

                    });
                }
                else{
                    db.close();
                    cbError();
                }
            });
        });
    }

    static accept(idFriend, cbSuccess, cbError){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            if (err) throw err;
            let dbo = db.db("iou");
            dbo.collection("friends").findOne({id_asker : idFriend.toString()}, function(err, data){
                if(err) throw err;
                if(data.length !== 0){
                    dbo.collection('friends').updateOne({_id : Mongo.ObjectId(data._id)}, {$set : {confirmed : true}}, function(err, data2){
                        if(err) throw err;
                        if(data2.result.n === 1){
                            db.close();
                            cbSuccess();
                        }
                        else{
                            db.close();
                            cbError();
                        }

                    });
                }
                else{
                    db.close();
                    cbError();
                }
            });
        });
    }

    static getNumberFriendAsks(cb){
        this.getAllFriendAsks(function(friends){
           cb(friends.length);
        });
    }


    static getAllFriend(userId, cb){
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db("iou");
            dbo.collection("friends").find({$or : [{id_asker : userId.toString(), confirmed: true}, {id_recever: userId.toString(), confirmed:true}]}).toArray((err, data) => {
               if(err) throw err;
               let toReturn = [];
               let i = 0;
               data.forEach(function(fri){
                   i++;
                   new Friend(fri._id, function(friend){
                      toReturn.push(friend);
                       if(i===data.length){
                           cb(toReturn);
                           db.close();
                       }
                   });
               });
               if(data.length ===0){
                   cb(toReturn);
                   db.close();
               }


            });
        })
    }

    static getAllAsksFriends(userId, cb){
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db("iou");
            dbo.collection("friends").find({id_recever: userId.toString(), confirmed:false}).toArray((err, data) => {
                if(err) throw err;
                let toReturn = [];
                let i = 0;
                data.forEach(function(fri){
                    i++;
                    new Friend(fri._id, function(friend){
                        toReturn.push(friend);
                        if(i===data.length){
                            cb(toReturn);
                            db.close();
                        }
                    });
                });


            });
        })
    }

    static create(cb){
        MongoClient.connect(conf.db.url, (err, db) => {
           if(err) throw err;
           let dbo = db.db('iou');
           let objectToInsert = {
               id_asker : Mongo.ObjectId(),
               id_recever : Mongo.ObjectId(),
               confirmed : false
           };
           dbo.collection('friends').insertOne(objectToInsert);
        });
    }

}
module.exports = Friend;