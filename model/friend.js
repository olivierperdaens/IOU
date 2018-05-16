let conf = require('../congif/config');
let Mongo = require('mongodb');
let MongoClient = Mongo.MongoClient;
let Server = require('mongodb').Server;
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

    get id(){
        return this._id;
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

    static getAllUsersList(cb){
        MongoClient.connect(conf.db.url, function(err, db) {
            let dbo = db.db('iou');
            dbo.collection('users').find({}).toArray(function (err, allUsers) {
                if (err) throw err;
                cb(allUsers);
            });
        });
    }

    static getAllFriendsConfirmedList(cb){
        let self = this;
        MongoClient.connect(conf.db.url, function (err, db) {
           if(err) throw err;
           let dbo = db.db('iou');
            dbo.collection('friends').find({$or: [{id_asker: conf.connectedUser.toString(), confirmed: true}, {id_recever: conf.connectedUser.id.toString(), confirmed: true}]}).toArray(function(err, allFriendsConfirmed){
                if(err) throw err;
                let listFriendsConfirmed = [];
                let i = 0;
                if(allFriendsConfirmed.length === 0){
                    cb([]);
                }
                allFriendsConfirmed.forEach(function (friendsConfirmed) {
                    i++;
                    self.getOtherUser(friendsConfirmed._id, function (friendUser){
                        listFriendsConfirmed.push(friendUser);
                        if(i === allFriendsConfirmed.length){
                            cb(listFriendsConfirmed);
                        }
                    })
                });
            });
        });

    }

    static getAllWaitingFriendsList(cb){
        let self = this;
        MongoClient.connect(conf.db.url, function(err, db){
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection('friends').find({$or: [{id_asker: conf.connectedUser.id.toString(), confirmed: false}, {id_recever: conf.connectedUser.id.toString(), confirmed: false}]}).toArray(function(err, allFriendsWaiting){
                if(err) throw err;
                let listFriendsWaiting = [];
                let i = 0;
                if(allFriendsWaiting.length === 0){
                    cb([]);
                }
                allFriendsWaiting.forEach(function (friendsWaiting) {
                    i++;
                    self.getOtherUser(friendsWaiting._id, function (friendUser){
                        listFriendsWaiting.push(friendUser);
                        if(i === allFriendsWaiting.length){
                            cb(listFriendsWaiting);
                        }
                    })
                });
            });
        })
    }

    static getFriendsToAddList2(cb){
        let list = [];
        let self = this;
        self.getAllUsersList(function(allUsersList){
            self.getAllFriendsConfirmedList(function(allFriendsConfirmedList){
                self.getAllWaitingFriendsList(function(allFriendsWaitingList){
                    for(let i=0; i<allUsersList.length; i++){

                        let notKnow = true;
                        for(let j=0; j<allFriendsConfirmedList.length; j++){
                            if(allUsersList[i]._id.toString().localeCompare(allFriendsConfirmedList[j]._id.toString()) ===  0){
                                notKnow = false;
                            }
                        }

                        for(let k=0; k<allFriendsWaitingList.length; k++){
                            if(allUsersList[i]._id.toString().localeCompare(allFriendsWaitingList[k]._id.toString()) === 0){
                                notKnow = false;
                            }
                        }

                        if(allUsersList[i]._id.toString().localeCompare(conf.connectedUser.id.toString()) === 0){
                            notKnow = false;
                        }

                        if(notKnow){
                            list.push(allUsersList[i]);
                        }
                    }
                    cb(list);
                });
            });
        });
    }

    static addFriend(email, cbSuccess, cbError){
        let self = this;
        this.getFriendsToAddList2(function(listFriendsToAdd){
            let isCorrectToAdd = false;

            if(listFriendsToAdd.length === 0){
                console.log("lg 0");
                cbError();
            }

            for(let i = 0; i<listFriendsToAdd.length; i++){
                if(listFriendsToAdd[i].email.localeCompare(email) === 0){
                    isCorrectToAdd = true;
                }
            }

            if(isCorrectToAdd){
                self.create(email,function(){
                    cbSuccess();
                }, function(){
                    cbError();
                });
            }
            else{
                cbError();
            }
        })
    }

    static getFriendslist(cb){
        let list = [];
        this.getAllFriend(conf.connectedUser.id, function(res){
            let i = 0;
            if(res.length === 0){
                cb(list);
            }
            else{
                res.forEach(function(item){
                    i++;
                    item.getOtherUser(function(user){
                        list.push(user);
                        if(i===res.length){
                            cb(list);
                        }
                    });
                });
            }
        });
    }

    static findAllUsers(cb){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            if (err) throw err;
            let dbo = db.db("iou");
            dbo.collection('users').find({}).toArray(function(err, all) {
                if (err) throw err;
                cb(all);
            });
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
        });
    }

    static getOtherUser(id_friend, cb){
        MongoClient.connect(conf.db.url, function(err, db){
            let dbo = db.db('iou');
            dbo.collection('friends').findOne({_id: Mongo.ObjectId(id_friend)}, function(err, data){
                if(err) throw err;
                if(data.id_asker.toString().localeCompare(conf.connectedUser.id.toString())===0){
                   dbo.collection('users').findOne({_id: Mongo.ObjectId(data.id_recever)}, function(err, result){
                       if(err) throw err;
                       cb(result);
                   });
               }
               else{
                    dbo.collection('users').findOne({_id: Mongo.ObjectId(data.id_asker)}, function(err, result){
                        if(err) throw err;
                        cb(result);
                    });
                }
            });
        });
    }

    static create(email_recever, cbSuccess, cbError){
        MongoClient.connect(conf.db.url, (err, db) => {
           if(err) throw err;
           let dbo = db.db('iou');
           dbo.collection('users').findOne({email: email_recever}, function (err, UserRecever) {
               if(err) throw err;
               let objectToInsert = {
                   id_asker : conf.connectedUser.id.toString(),
                   id_recever : UserRecever._id.toString(),
                   confirmed : false
               };
               dbo.collection('friends').insertOne(objectToInsert, function(err, res){
                   if(err) throw err;
                   if(res.insertedId){
                       db.close();
                       cbSuccess();
                   }
                   else{
                       db.close();
                       cbError();
                   }
               });
           });
        });
    }

}
module.exports = Friend;