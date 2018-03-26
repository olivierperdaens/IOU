let express = require('express');
let router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let auth = require("../model/Auth");
let friend = require("../model/Friend");

/* GET home page. */
router.get('/', function(req, res) {
    auth.nbrFriendsAsks(req.session.email, req.session.password, function(nbrFriendsAsks){
        let session = req.session;
        let page = {
            title : "IOU",
            id_active: "friends"
        };
        auth.userInfo(session.email, session.password, function(info){
            res.render('friends',{page, user: info, nbrFriendsAsks});
        });
    });

});

module.exports = router;
