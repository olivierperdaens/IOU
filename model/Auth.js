let Mongo = require("mongodb");
let MongoClient = Mongo.MongoClient;
let Server = require('mongodb').Server;

class Auth{

    static isUser(email, password, cbWrongUser, cbWrongPassword, cbSuccess){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            if (err) throw err;
            let dbo = db.db("iou");
            dbo.collection('users').findOne({email:email}, function(err, doc){
                if (err) throw err;
                // Check user exists
                if(doc !== null) {
                    dbo.collection("users").findOne({email: email, password: password}, function(err, result){
                        // Check password correct and correspond to this user
                        if(result !== null){
                            cbSuccess(doc);
                        }
                        else{
                            cbWrongPassword();
                        }
                    });
                }
                else{
                    cbWrongUser();
                }
                db.close();
            });
        });
    }

    static userId(email, password, cb){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            if (err) throw err;
            let dbo = db.db("iou");
            dbo.collection("users").findOne({email: email, password: password}, function (err, result) {
                if (err) throw err;
                cb(result._id);
                db.close();
            });
        });
    }

    static userInfo(id, cb){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            if (err) throw err;
            let dbo = db.db("iou");
            dbo.collection("users").findOne({_id: Mongo.ObjectId(id)}, function (err, result) {
                if (err) throw err;
                cb(result);
                db.close();
            });
        });
    }

    static nbrFriendsAsks(email, password, cb){
        this.userId(email, password, function(id_user){
            Auth.userInfo(id_user, function(info){
                let friends = info.friends;
                let nbr = 0;
                for(let i = 0; i<friends.length; i++){
                    if(!friends[i].confirmed){
                        nbr ++;
                    }
                }
                cb(nbr);
            });
        });

    }


}

module.exports = Auth;