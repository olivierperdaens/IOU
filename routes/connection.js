let express = require('express');
let router = express.Router();
let auth = require("../model/auth");


/* GET | DISPLAY CONNECT PAGE */
router.get('/connect', function(req, res) {
    let page = {
        title : "IOU"
    };
    res.render('connection/index', {page});

});



/* POST | WHEN USER TRY TO CONNECT */
// TODO persistance des données en cas d'échec
router.post('/connect', function(req, res){
    let email = req.body.email;
    let password = req.body.password;

    auth.isUser(
        email,
        password,
        ()=>{
            req.flash("danger", 'Utilisateur inconnu !');
            res.redirect("/connection/connect");
        },
        ()=>{
            req.flash("danger", "Mot de passe erroné !");
            res.redirect("/connection/connect");
        },
        ()=>{
            req.session.email = email;
            req.session.password = password;
            req.flash('success', "Bienvenue sur IOU !");
            res.redirect("/");
        }
    );
    //TODO accès aux variable de session trop long !
});

/* GET | DISPLAY NEW ACCOUNT PAGE */
router.get('/new_account', function(req, res) {
    //TODO new account page
    res.send("new_account");

});



module.exports = router;
