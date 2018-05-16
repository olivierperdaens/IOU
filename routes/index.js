let express = require('express');
let router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let auth = require("../model/auth");
let friend = require("../model/friend");
let conf = require("../congif/config");

/* GET home page. */
router.get('/', function(req, res) {
    friend.getNumberFriendAsks(function(nbrFriendsAsks){
        let page = {
            title: "IOU",
            id_active: "dettes"
        };
        res.render('index', {nbrFriendsAsks, page});
    });
});



/*
static getDebts(){
        let list = [];
        MongoClient.connect(conf.db.url, (err, db) => {
            if(err) throw err;
            let dbo = db.db('iou');
            dbo.collection("debts").find({id_receiver: conf.connectedUser.id.toString(), confirmed: false}).toArray((err, res)=>{
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
 */




module.exports = router;
