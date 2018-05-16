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




module.exports = router;
