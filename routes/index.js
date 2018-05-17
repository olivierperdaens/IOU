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
    friend.getNumberFriendAsks(function(nbrFriendsAsks){
        debt.getAllDebtAllUsers(function(debts){
            console.log(debts);
            let page = {
                title : "IOU",
                id_active: "dettes"
            };
            let balanceTotale = 0;
            for(let i=0; i<debts.length; i++){
                balanceTotale += (debts[i].ammount);
            }
            res.render('index', {page, debts, balanceTotale, nbrFriendsAsks});
        });
    });
});


router.post('/getDebtHistory', function(req, res){
    let user_id = req.body.id_user;
   debt.getAllDebtsOneUserConfirmed(user_id, function(historique){
       res.json(historique);
   })
});


module.exports = router;
