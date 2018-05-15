let Mongo = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let conf = require('../congif/config');
let friend = require('../model/friend');

class User {

  constructor(id_user, callback) {
      this._id = id_user;
      this.loadData(callback);
  }

  loadData(cb){
      let self = this;
      MongoClient.connect(conf.db.url, (err, db) => {
         if(err) throw err;
         let dbo = db.db('iou');
         dbo.collection('users').findOne({_id : Mongo.ObjectId(this._id)}, (err, data) => {
            if(err) throw err;
            if(data != null && data !== undefined){
                this._nom = data.nom;
                this._prenom = data.prenom;
                this._email = data.email;
                this._password = data.password;
                cb(self);
                db.close();
            }
         });
      });
  }

  get id(){
      return this._id;
  }

  getFriends(cb){
      friend.getAllFriend(this._id, function(res){
          cb(res);
      });
  }

  getFriendslist(cb){
      let list = [];
      this.getFriends(function(res){
          for(let item in res){
              list.push(item.getOtherUser())
          }
      });
  }

  get email(){
      return this._email;
  }

  get nom(){
      return this._nom;
  }

  get prenom(){
      return this._prenom;
  }

  LogOut(req, cb){
      conf.connectedUser = null;
      req.session.email = null;
      req.session.password = null;
      req.session.destroy();
      cb();
  }


  static findAll(cb){
      MongoClient.connect('mongodb://localhost:27017', (err, db) => {
          if (err) throw err;
          let dbo = db.db("iou");
          dbo.collection('users').find({}, function(err, all) {
              if (err) throw err;
              cb(all);
          });
      });
  }

}

module.exports = User;
