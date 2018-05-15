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
            title : "IOU",
            id_active: "friends"
        };
        let friends = conf.connectedUser.friends;
        console.log(friends);
        res.render('friends', {page, nbrFriendsAsks, friends});
    });

});

/* POST ACCEPT FRIEND */
router.get('/accept/:email', function(req, res){
    let emailFriend = req.params.email;
    auth.userInfo(req.session.email, req.session.password, function(userInfo){
        MongoClient.connect('mongodb://localhost:27017', (err, db) => {
            if (err) throw err;
            let dbo = db.db("iou");
            let friendsTab = userInfo.friends;
            for(let i=0; i<friendsTab.length; i++){
               if(friendsTab[i].email === emailFriend){
                   friendsTab[i].confirmed = true;
               }
            }
            dbo.collection("users").updateOne({email: userInfo.email, password: userInfo.password}, {$set: {friends: friendsTab}}, function (err) {
                if (err) throw err;
                db.close();
                res.redirect("/friends");
            });
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
