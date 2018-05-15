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

module.exports = router;
