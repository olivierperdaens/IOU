let conf = require('../congif/config');
let Mongo = require('mongodb');
let MongoClient = Mongo.MongoClient;
let Server = require('mongodb').Server;
let auth = require('../model/auth');
let moment = require('moment');

class Debt {

    static create(id_recever, description, ammount, cbSuccess, cbError){
        MongoClient.connect(conf.db.url, function(err, db){
            let day = moment().format("YYYY-MM-DDTHH:mm:ss");
            console.log(day);
            let dbo = db.db('iou');
            let objectToInsert = {
                id_debt_sender : conf.connectedUser.id.toString(),
                id_debt_receiver : id_recever,
                ammount : ammount,
                description : description,
                date : day,
                confirmed : false
            };
            dbo.collection("debts").insertOne(objectToInsert, function(err, res){
                if(err) cbError();
                if(res.insertId){
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

    static delete(id_debt, cbSuccess, cbError){
        MongoClient.connect(conf.db.url, function(err, db){
            if(err) cbError();
            let dbo = db.db('iou');
            dbo.collection('debts').deleteOne({_id : MongoClient.ObjectId(id_debt)}, function(err, res){
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

    static getAllDebtsOneUserConfirmed(id_user, cb){
        MongoClient.connect(conf.db.url, function(err, db){
           if(err) throw err;
           let dbo = db.db('iou');
           dbo.collection('debts').find({$or : [{id_debt_sender: id_user.toString(), id_debt_receiver: conf.connectedUser.id.toString(), confirmed : true}, {id_debt_sender: conf.connectedUser.id.toString(), id_debt_receiver : id_user.toString(), confirmed: true}]}).toArray(function(err, res) {
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
                        total -= (listDebtsUser[i].ammount);
                    }
                    else{
                        total += (listDebtsUser[i].ammount);
                    }
                }
                let objectReturn = {
                    ammount : total,
                    user : userInfo.prenom + " " + userInfo.nom,
                    id_other_user : userInfo._id
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
            listIdUser.forEach(function(idUser){
                i ++;
                self.getBalanceByUser(idUser, function(obj){
                    list.push(obj);
                    if(i === listIdUser.length){
                        cb(list);
                    }
                });
            })
        });
    }

}

module.exports = Debt;
