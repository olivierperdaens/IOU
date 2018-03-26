let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;


class Db{
    static dbo(cb){
        let dbo;
        if(dbo !== undefined && dbo !== null){
            cb(dbo)
        }
        else{
            MongoClient.connect('mongodb://localhost:27017', (err, db) => {
                if (err) throw err;
                dbo = db.db("iou");
                cb(dbo);
            });
        }
    };
}
module.exports = Db;