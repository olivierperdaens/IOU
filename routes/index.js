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
    let page = {
        title : "IOU",
        id_active: "dettes"
    };
    let debts = [
        {
            user : "Olivier Perdaens",
            amount : 150
        },
        {
            user: "Jean Dupont",
            amount: -100
        }
    ];
    let balanceTotale = 0;
    for(let i=0; i<debts.length; i++){
        balanceTotale += debts[i].amount;
    }
    res.render('index', {page, debts, balanceTotale});
});




module.exports = router;
