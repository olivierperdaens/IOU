let conf = require('../congif/config');
let Mongo = require('mongodb');
let MongoClient = Mongo.MongoClient;
let Server = require('mongodb').Server;
let auth = require('../model/auth');
let moment = require('moment');

class Debt {

    static create(id_recever, description, ammount, date=null, cbSuccess, cbError){
        MongoClient.connect(conf.db.url, function(err, db){
            let day;
            if(date === null){
                day = moment().format("YYYY-MM-DDTHH:mm:ss");
            }
            else{
                day = moment(date).format("YYYY-MM-DDTHH:mm:ss");
            }
            let dbo = db.db('iou');
            let objectToInsert = {
                id_debt_creator : conf.connectedUser.id.toString(),
                id_debt_sender : conf.connectedUser.id.toString(),
                id_debt_receiver : id_recever,
                ammount : ammount,
                description : description,
                date : day,
                confirmed : false
            };
            dbo.collection("debts").insertOne(objectToInsert, function(err, res){
                if(err) cbError();
                if(res.insertedCount === 1){
                    db.close();
                    cbSuccess();
                }
                else{
                    db.close();
                    cbError();
                }
            });

        });
    }

    static createReverse(id_sender, description, ammount, date=null, cbSuccess, cbError){
        MongoClient.connect(conf.db.url, function(err, db){
            let day;
            if(date === null){
                day = moment().format("YYYY-MM-DDTHH:mm:ss");
            }
            else{
                day = moment(date).format("YYYY-MM-DDTHH:mm:ss");
            }
            let dbo = db.db('iou');
            let objectToInsert = {
                id_debt_creator : conf.connectedUser.id.toString(),
                id_debt_sender : id_sender,
                id_debt_receiver : conf.connectedUser.id.toString(),
                ammount : ammount,
                description : description,
                date : day,
                confirmed : false
            };
            dbo.collection("debts").insertOne(objectToInsert, function(err, res){
                if(err) cbError();
                if(res.insertedCount === 1){
                    db.close();
                    cbSuccess();
                }
                else{
                    db.close();
                    cbError();
                }
            });

        });
    }

    static getAllDebtsOneUserConfirmed(id_user, cb){
        MongoClient.connect(conf.db.url, function(err, db){
           if(err) throw err;
           let dbo = db.db('iou');
           dbo.collection('debts').find({$or : [{id_debt_sender: id_user.toString(), id_debt_receiver: conf.connectedUser.id.toString(), confirmed : true}, {id_debt_sender: conf.connectedUser.id.toString(), id_debt_receiver : id_user.toString(), confirmed: true}]}).sort({date : -1}).toArray(function(err, res) {
               if(err) throw err;
               if(res.length === 0){
                   db.close();
                   cb([]);
               }
               else{
                   db.close();
                   cb(res);
               }
           });
        });
    }

    static getUserInfo(id_user, cb){
        MongoClient.connect(conf.db.url, function(err, db){
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection('users').findOne({_id : Mongo.ObjectId(id_user)}, function (err, res){
               if(err) throw err;
               cb(res);
            });
        })
    }

    static getBalanceByUser(id_user, cb){
        let self = this;
        this.getUserInfo(id_user, function(userInfo){
            self.getAllDebtsOneUserConfirmed(id_user, function(listDebtsUser){
                let total = 0;
                for(let i=0; i<listDebtsUser.length; i++){
                    if(listDebtsUser[i].id_debt_sender.toString().localeCompare(id_user.toString())===0){
                        total -= parseFloat(listDebtsUser[i].ammount);
                    }
                    else{
                        total += parseFloat(listDebtsUser[i].ammount);
                    }
                }
                let objectReturn = {
                    ammount : total,
                    user : userInfo.prenom + " " + userInfo.nom,
                    id_other_user : userInfo._id,
                };
                cb(objectReturn);
            });
        })

    }

    static getUserIdList(cb){
        let listUserId = [];
        MongoClient.connect(conf.db.url, function(err, db){
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection('debts').find({$or : [{id_debt_sender : conf.connectedUser.id.toString(), confirmed: true}, {id_debt_receiver : conf.connectedUser.id.toString(), confirmed : true}]}).toArray(function(err, data){
                if(err) throw err;
                for(let i=0; i<data.length; i++){
                    // Si sender est user connecté -> enregistre le receiver
                    if(data[i].id_debt_sender.toString().localeCompare(conf.connectedUser.id.toString()) === 0){
                        // Si user est déjà dans la liste, on ne l'ajoute pas
                        if(!listUserId.includes(data[i].id_debt_receiver)){
                            listUserId.push(data[i].id_debt_receiver);
                        }
                    }
                    else{
                        if(!listUserId.includes(data[i].id_debt_sender)){
                            listUserId.push(data[i].id_debt_sender);
                        }
                    }
                }
                cb(listUserId);
            });
        })
    }

    static getAllDebtAllUsers(cb){
        let list = [];
        let self = this;
        this.getUserIdList(function(listIdUser){
            let i = 0;
            if(listIdUser.length === 0){
                cb([]);
            }
            for(let i=0; i<listIdUser.length; i++){
                self.getBalanceByUser(listIdUser[i], function(obj){
                    list.push(obj);
                    if(i === listIdUser.length-1){
                        cb(list);
                    }
                });
            }
        });
    }

    static getAllWaitingDebtNotCreated(cb){
        let self = this;
        let tab = [];
        MongoClient.connect(conf.db.url, function(err, db){
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection('debts').find({$query : {$and : [{$or : [{id_debt_sender : conf.connectedUser.id.toString(), confirmed : false}, {id_debt_receiver : conf.connectedUser.id.toString(), confirmed : false}]}, {id_debt_creator : {$ne : conf.connectedUser.id.toString()}}]}, $orderby : {date : -1}}).toArray(function(err, res){
                if(err) throw err;
                let count = 0;
                if(res.length === 0){
                    cb([]);
                }
                else{
                    for(let i=0; i<res.length; i++){
                        self.getUserInfo(res[i].id_debt_receiver, function(receiverInfo){
                            self.getUserInfo(res[i].id_debt_sender, function(senderInfo){
                                if(res[i].id_debt_sender.toString().localeCompare(conf.connectedUser.id.toString())===0){
                                    let objToAdd = {
                                        id : res[i]._id,
                                        ammount : res[i].ammount,
                                        description : res[i].description,
                                        date : moment(res[i].date).fromNow(),
                                        user : receiverInfo.prenom + " " + receiverInfo.nom,
                                        role : "sender"
                                    };
                                    tab.push(objToAdd);
                                    if(i === res.length-1){
                                        cb(tab);
                                    }
                                }
                                else{
                                    let objToAdd = {
                                        id : res[i]._id,
                                        ammount : res[i].ammount,
                                        description : res[i].description,
                                        date : moment(res[i].date).fromNow(),
                                        user : senderInfo.prenom + " " + senderInfo.nom,
                                        role : "receiver"
                                    };
                                    tab.push(objToAdd);
                                    if(i === res.length-1){
                                        cb(tab);
                                    }
                                }
                            });
                        });
                    }
                }
           });
        });
    }

    static getAllWaitingDebtCreated(cb){
        let self = this;
        MongoClient.connect(conf.db.url, function(err, db){
           if(err) throw err;
           let tab = [];
           let dbo = db.db('iou');
           dbo.collection("debts").find({$query : {id_debt_creator : conf.connectedUser.id.toString(), confirmed: false}, $orderby : {date : -1}}).toArray(function(err, res){
                if(err) throw err;
                let count = 0;
                if(res.length === 0){
                    cb([]);
                }
                else{
                    for(let i=0; i<res.length; i++){
                        self.getUserInfo(res[i].id_debt_receiver, function(receiverInfo){
                            self.getUserInfo(res[i].id_debt_sender, function(senderInfo){
                                if(res[i].id_debt_sender.toString().localeCompare(conf.connectedUser.id.toString())===0){
                                    let objToAdd = {
                                        id : res[i]._id,
                                        ammount : res[i].ammount,
                                        description : res[i].description,
                                        date : moment(res[i].date).fromNow(),
                                        user : receiverInfo.prenom + " " + receiverInfo.nom,
                                        role : "sender"
                                    };
                                    tab.push(objToAdd);
                                    if(i === res.length-1){
                                        cb(tab);
                                    }
                                }
                                else{
                                    let objToAdd = {
                                        id : res[i]._id,
                                        ammount : res[i].ammount,
                                        description : res[i].description,
                                        date : moment(res[i].date).fromNow(),
                                        user : senderInfo.prenom + " " + senderInfo.nom,
                                        role : 'receiver'
                                    };
                                    tab.push(objToAdd);
                                    if(i === res.length-1){
                                        cb(tab);
                                    }
                                }
                            });
                        });
                    }
                }
           })
        });
    }

    static acceptDebt(id_debt, cbSuccess, cbError){
        MongoClient.connect(conf.db.url, function(err, db){
           if(err) throw err;
           let dbo = db.db('iou');
           dbo.collection("debts").updateOne({_id : Mongo.ObjectId(id_debt)}, {$set : {confirmed : true}}, function(err, res){
              if(err) throw err;
              if(res.modifiedCount === 1){
                  cbSuccess();
              }
              else{
                  cbError();
              }
           });
        });
    }

    static delete(id_debt, cbSuccess, cbError){
        MongoClient.connect(conf.db.url, function(err, db){
            if(err) cbError();
            let dbo = db.db('iou');
            dbo.collection('debts').deleteOne({_id : Mongo.ObjectId(id_debt)}, function(err, res){
                if(err) cbError();
                if(res.deletedCount === 1){
                    db.close();
                    cbSuccess();
                }
                else{
                    db.close();
                    cbError();
                }
            });
        });
    }

}

module.exports = Debt;
