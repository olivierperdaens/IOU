let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;

class User {

  constructor(name) {
    this.name = name
    this.friends = []
  }

  addFriend(user){
    this.friends.push(user)
    if(!user.isFriendWith(this)){
      user.addFriend(this)
    }
  }

  isFriendWith(user){
    return this.friends.includes(user)
  }

  getFriendList(){

  }

  static getFriendList(){
      //TODO implement friendlist User non static
      MongoClient.connect('mongodb://localhost:27017', (err, db) => {
          if (err) throw err;
          let dbo = db.db("iou");
          dbo.collection('users').find({}, function(err, all) {
              if (err) throw err;
              cb(all);
          });
      });
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
