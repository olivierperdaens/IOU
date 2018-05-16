let express = require('express');
let router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let auth = require("../model/auth");
let friend = require("../model/friend");
let debt = require ("../model/debt");
let conf = require("../congif/config");

/* GET home page. */
router.get('/', function(req, res) {
    debt.getNumberDebts(function(nbrDebts){
        conf.connectedUser.getDebtsList(function(debts){

                let page = {
                    title : "IOU",
                    id_active: "dettes"
                };

                res.render('index', {page, nbrDebts, debts });

        });

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
