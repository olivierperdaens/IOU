let express = require('express');
let router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let auth = require("../model/auth");


/* GET | DISPLAY CONNECT PAGE */
router.get('/connect', function(req, res) {
    let page = {
        title : "IOU"
    };
    res.render('connection/index', {page});

});



/* POST | WHEN USER TRY TO CONNECT */
//TODO persistance des données en cas d'échec
router.post('/connect', function(req, res){
    let email = req.body.email;
    let password = req.body.password;

    auth.isUser(
        email,
        password,
        ()=>{
            req.flash("danger", 'Utilisateur inconnu !');
            res.redirect("/connect");
        },
        ()=>{
            req.flash("danger", "Mot de passe erroné !");
            res.redirect("/connect");
        },
        ()=>{
            req.session.email = email;
            req.session.password = password;
            req.flash('success', "Bienvenu sur IOU !");
            res.redirect("/");
        }
    );
});

/* GET | DISPLAY CONNECT PAGE */
router.get('/new_account', function(req, res) {
    //TODO new account page
    res.send("new_account");

});



module.exports = router;
