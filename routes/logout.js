let express = require('express');
let router = express.Router();
let auth = require("../model/auth");
let conf = require("../congif/config");
let user = require("../model/user");


router.get('/', function(req, res){
    if(conf.connectedUser !== null){
        new user(conf.connectedUser.id, (Usr)=>{
            Usr.LogOut(req, ()=>{
                res.redirect('/connection/connect');
            });
        });
    }
});

module.exports = router;

