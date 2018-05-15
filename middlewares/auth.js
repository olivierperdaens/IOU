module.exports = function(request, response, next){
    let sess = request.session;
    let auth = require('../model/auth');
    let User = require("../model/user");
    let conf = require("../congif/config");

    if(request.url.substring(0,11) !== "/connection") {
        if (sess.email !== undefined && sess.password !== undefined) {
            auth.isUser(
                sess.email,
                sess.password,
                () => {
                    request.flash("danger", "Vous devez être connecté pour accéder à ce contenu !");
                    conf.connectedUser = null;
                    response.redirect("/connection/connect");
                },
                () => {
                    request.flash("danger", "Vous devez être connecté pour accéder à ce contenu !");
                    conf.connectedUser = null;
                    response.redirect("/connection/connect");
                },
                (userInfo) => {
                    new User(userInfo._id, (usr) => {
                        response.locals.connectedUser = usr;
                        conf.connectedUser = usr;
                        next();
                    });


                });
        }
        else{
            request.flash("danger", "Vous devez être connecté pour accéder à ce contenu !");
            conf.connectedUser = null;
            response.redirect("/connection/connect");
        }
    }
    else{
        if (sess.email !== undefined && sess.password !== undefined) {
            auth.isUser(
                sess.email,
                sess.password,
                () => {
                    next();
                },
                () => {
                    next();
                },
                () => {
                    request.flash("info", "Vous êtes déjà connecté !");
                    response.redirect("/");
                });
        }
        else{
            next();
        }
    }
};