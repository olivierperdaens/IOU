let express = require('express');
let router = express.Router();
let Mongo = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let auth = require("../model/auth");
let friend = require("../model/friend");
let conf = require("../congif/config");

/* GET home page. */
router.get('/', function(req, res) {
    friend.getNumberFriendAsks(function(nbrFriendsAsks){
        conf.connectedUser.getFriendslist(function(friends){
            conf.connectedUser.getAsksFriendsList(function(asksFriends){
                let page = {
                    title : "IOU",
                    id_active: "friends"
                };
                console.log("Getting friends ");
                res.render('friends', {page, nbrFriendsAsks, friends, asksFriends});
            });
        });

    });

});

/* POST ACCEPT FRIEND */
router.get('/accept/:id', function(req, res){
    let idFriend = req.params.id;
    friend.accept(idFriend, function(){
        req.flash("success", "Demande acceptée !");
        res.redirect("/friends");
    }, function(){
        req.flash("warning", "La demande n'a pas été acceptuée suite à un problème technique !");
        res.redirect("/friends");
    });
});

/* POST REFUSE FRIEND */
router.get('/refuse/:id', function(req, res){
    let idFriend = req.params.id;
    friend.refuse(idFriend, function(){
        req.flash("success", "Demande refusée !");
        res.redirect("/friends");
    }, function(){
        req.flash("warning", "La demande n'a pas été refusée suite à un problème technique !");
        res.redirect("/friends");
    });
});

/* POST ADD FRIEND */
router.post('/add/:id', function(req, res){
    //TODO add friend
    res.send('add friend');
});


module.exports = router;
