let conf = require('../congif/config');
let Mongo = require('mongodb');
let MongoClient = Mongo.MongoClient;
let Server = require('mongodb').Server;
let user = require('../model/user');
let auth = require('../model/auth');
let debt = require("../model/debt");




class Debt {




    constructor(id, callback) {
        this._id = id;
        this.loadData(callback);
    }

    loadData(cb){
        console.log("loadingData");
        let self = this;
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection('debts').findOne({_id : Mongo.ObjectId(this._id)}, (err, data) => {
                if(err) throw err;
                if(data != null && data !== undefined){
                    this._id_debt_sender = data.id_debt_sender;
                    this._id_debt_receiver = data.id_debt_receiver;
                    this._amount = data.amount;
                    this._date_debt = data.date_debt;
                    this._description_debt = data.description_debt;
                    console.log("Amount : "+this._amount);
                    cb(self);
                    db.close();
                }
            });
        });
    }

    getDebtSender(cb){
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db("iou");
            dbo.collection("users").findOne({_id : Mongo.ObjectId(this._id_debt_sender)}, (err, res)=>{
                if(err) throw err;
                cb(res);
            });
        });
    }

    getDebtReceiver(cb){
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db("iou");
            dbo.collection("users").findOne({_id : Mongo.ObjectId(this._id_debt_receiver)}, (err, res)=>{
                if(err) throw err;
                cb(res);
            });
        });

    }

    async getOtherDebtUser(cb){
        if(conf.connectedUser.id === this._id_debt_receiver){
            this.getDebtReceiver(function(user){
                cb(user);
            });
        }
        else{
            this.getDebtSender(function(user){
                cb(user);
            });
        }
    }

    get amount(){
        return this._amount;
    }

    get sender(){
      return this._id_debt_sender;
    }

    get receiver(){
      return this._id_debt_receiver;
    }

    get date(){
      return this._date_debt;
    }

    get description(){
      return this._description_debt;
    }


    static getAllDebts( cb){
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db("iou");
            dbo.collection("debts").find({$or : [{id_debt_sender : conf.connectedUser.id.toString()}, {id_debt_receiver: conf.connectedUser.id.toString()}]}).toArray((err, data) => {
                if(err) throw err;
                let toReturn = [];
                let i = 0;
                data.forEach(function(dbt){
                    i++;
                    new Debt(dbt._id, function(debt){
                        toReturn.push(debt);
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



    static getNumberDebts(cb){
        this.getAllDebts(function(debts){
            cb(debts.length);
        });
    }


  addDebiteur(user){
    if(typeof this.crediteur === "undefined" || this.crediteur == null){
      this.debiteur = user
    }
    else{
      if(this.crediteur.isFriendWith(user)){
        this.debiteur = user
      }
      else{
        throw new Error("Users must be friends to share a debt")
      }
    }
  }

  addCrediteur(user){
    if(typeof this.debiteur === "undefined" || this.debiteur == null){
      this.crediteur = user
    }
    else{
      if(this.debiteur.isFriendWith(user)){
        this.crediteur = user
      }
      else{
        throw new Error("Users must be friends to share a debt")
      }
    }
  }

  addDebt(amount){
    this.amount += amount;
  }



    rembourseDebt(amount){
    if(this.amount - amount >= 0){
      this.amount -= amount
      if(this.amount === 0){
          this.cleared = true
      }
    }
    else{
      let old_debiteur = this.debiteur
      let old_crediteur = this.crediteur
      this.debiteur = old_crediteur
      this.crediteur = old_debiteur
      this.cleared = false
      this.amount = Math.abs(this.amount -= amount)
    }
  }

}

module.exports = Debt;
