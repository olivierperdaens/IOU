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

                res.render('friends', {page, nbrFriendsAsks, friends, asksFriends});
            });
        });

    });

});

/* POST ACCEPT FRIEND */
router.get('/accept/:id', function(req, res){
    let idFriend = req.params.id;
    MongoClient.connect('mongodb://localhost:27017', (err, db) => {
        if (err) throw err;
        let dbo = db.db("iou");
        dbo.collection("friends").findOne({id_asker : idFriend.toString()}, function(err, data){
            if(err) throw err;
            if(data.length !== 0){
                dbo.collection('friends').updateOne({_id : Mongo.ObjectId(data._id)}, {$set : {confirmed : true}}, function(err, data){
                    if(err) throw err;
                    if(data.result.ok == 1){
                        db.close();
                        req.flash("success", "Demande acceptée !");
                        res.redirect("/friends");
                    }
                    else{
                        db.close();
                        req.flash("warning", "La demande n'a pas été acceptuée suite à un problème technique !");
                        res.redirect("/friends");
                    }

                });
            }
            else{
                res.redirect("/friends");
            }
        });
    });
});

/* POST REFUSE FRIEND */
router.get('/refuse/:email', function(req, res){
    //TODO refuse friend
    res.send('refuse friend');
});

/* POST ADD FRIEND */
router.post('/add', function(req, res){
    //TODO add friend
    res.send('add friend');
});


module.exports = router;
