let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;

class Auth{

    static isUser(email, password, cbWrongUser, cbWrongPassword, cbSuccess){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            let dbo = db.db("iou");
            if (err) throw err;
            dbo.collection('users').findOne({email:email}, function(err, doc){
                if (err) throw err;

                // Check user exists
                if(doc !== null) {
                    dbo.collection("users").findOne({email: email, password: password}, function(err, result){

                        // Check password correct and correspond to this user
                        if(result !== null){
                            cbSuccess();
                        }
                        else{
                            cbWrongPassword();
                        }
                    });
                }
                else{
                    cbWrongUser();
                }
            });
        });
    }

    static userInfo(email, password, cb){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            let dbo = db.db("iou");
            if (err) throw err;
            dbo.collection("users").findOne({email: email, password: password}, function (err, result) {
                if (err) throw err;
                cb(result);
            });
        });
    }
}

module.exports = Auth;