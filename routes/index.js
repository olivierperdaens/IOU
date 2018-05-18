let express = require('express');
let router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;
let auth = require("../model/auth");
let friend = require("../model/friend");
let debt = require ("../model/debt");
let conf = require("../congif/config");
let user = require("../model/user");

/* GET home page. */
router.get('/', function(req, res) {
    friend.getNumberFriendAsks(function(nbrFriendsAsks){
        debt.getAllDebtAllUsers(function(debts){
            debt.getAllWaitingDebtCreated(function (waitingDebtsCreated){
                debt.getAllWaitingDebtNotCreated(function(waitingDebtsNotCreated){
                    friend.getFriendslist(function(userFriends){
                        console.log(userFriends);
                        let page = {
                            title : "IOU",
                            id_active: "dettes"
                        };
                        let balanceTotale = 0.0;
                        for(let i=0; i<debts.length; i++){
                            balanceTotale += parseFloat(debts[i].ammount);
                        }
                        res.render('index', {page, debts, balanceTotale, nbrFriendsAsks, userFriends, waitingDebtsCreated, waitingDebtsNotCreated});
                    });
                });
            });
        });
    });
});


router.post('/getDebtHistory', function(req, res){
    let user_id = req.body.id_user;
   debt.getAllDebtsOneUserConfirmed(user_id, function(historique){
       res.json(historique);
   })
});

router.post('/addDebt', function(req, res){
   let description = req.body.newDebtDescription;
   let ammount = req.body.newDebtAmmount;
   let user_id = req.body.newDebtOtherUser;
   let date = null;
   if(req.body.newDebtAntidate !== undefined){
       date = req.body.newDebtDate;
   }

   debt.create(user_id, description, ammount, date, function(){
       req.flash("success", "Dette enregistrée avec succès !");
       res.redirect("/");
   }, function(){
       req.flash("danger", "Une erreur est survenue lors de la création de la dette ... Veuillez réessayer !");
       res.redirect("/");
   });
});

router.post('/rembourserDebt', function(req, res){
    let description = req.body.newDebtReverseDescription;
    let ammount = req.body.newDebtReverseAmmount;
    let user_id = req.body.newDebtReverseOtherUser;
    let date = null;
    if(req.body.newDebtReverseAntidate !== undefined){
        date = req.body.newDebtReverseDate;
    }

    debt.createReverse(user_id, description, ammount, date, function(){
        req.flash("success", "Dette enregistrée avec succès !");
        res.redirect("/");
    }, function(){
        req.flash("danger", "Une erreur est survenue lors de la création de la dette ... Veuillez réessayer !");
        res.redirect("/");
    });
});

router.get("/acceptDebt/:idDebt", function(req, res){
    let id_debt = req.params.idDebt;
    console.log(id_debt);
    debt.acceptDebt(id_debt, function(){
        req.flash("success", "Dette acceptée !");
        res.redirect("/");
    }, function(){
        req.flash("danger", "Une erreur est survenue en acceptant la dette... Veuillez réessayer !");
        res.redirect('/');
    })
});

router.get("/refuseDebt/:idDebt", function(req, res){
    let id_debt = req.params.idDebt;
    debt.delete(id_debt, function(){
        req.flash("success", "Dette refusée !");
        res.redirect("/");
    }, function(){
        req.flash("danger", "Une erreur est survenue en supprimant la dette... Veuillez réessayer !");
        res.redirect('/');
    })
});


module.exports = router;
