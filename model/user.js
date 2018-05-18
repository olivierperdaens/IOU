let Mongo = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let conf = require('../congif/config');
let friend = require('../model/friend');
let debt = require ('../model/debt');

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


  getAsksFriendsList(cb){
      let list = [];
        friend.getAllFriendAsks(function(res){
            let i = 0;
            if(res.length===0){
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

  getFriends(cb){
      friend.getAllFriend(this._id, function(res){
          cb(res);
      });
  }

  getFriendslist(cb){
      let list = [];
      this.getFriends(function(res){
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


    static getFriendsListPredictor(id_user, cb){
        new User(id_user, function(User){
            User.getFriendslist(function(data){
                cb(data);
            })
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
          dbo.collection('users').find({}).toArray(function(err, all) {
              if (err) throw err;
              cb(all);
          });
      });
  }

  static getUserInfo(id_user, cb){
      MongoClient.connect(conf.db.url, function(err, db){
         if(err) throw err;
         let dbo = db.db('iou');
         dbo.collection('users').findOne({_id : Mongo.ObjectId(id_user)}, function(err, res){
             if(err) throw err;
             cb(res);
         })
      });
  }

  static create(nom, prenom, email, password, cbSuccess, cbError){
      MongoClient.connect(conf.db.url, function(err, db){
          if(err) throw err;
          let dbo = db.db("iou");
          let objToInsert = {
              nom : nom,
              prenom : prenom,
              email : email,
              password : password
          };
          dbo.collection('users').insertOne(objToInsert, function(err, res){
              if(err) throw err;
              if(res.insertedCount === 1){
                  cbSuccess();
              }
              else{
                  cbError();
              }
          })
      })
  }

}

module.exports = User;
