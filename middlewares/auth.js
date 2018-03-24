module.exports = function(request, response, next){
    let sess = request.session;
    let auth = require('../model/auth');

    if(request.url !== "/connect") {
        if (sess.email !== undefined && sess.password !== undefined) {
            auth.isUser(
                sess.email,
                sess.password,
                () => {
                    request.flash("danger", "Vous devez être connecté puor accéder à ce contenu !");
                    response.redirect("/connect");
                },
                () => {
                    request.flash("danger", "Vous devez être connecté puor accéder à ce contenu !");
                    response.redirect("/connect");
                },
                () => {
                    next();
                });
        }
        else{
            request.flash("danger", "Vous devez être connecté puor accéder à ce contenu !");
            response.redirect("/connect");
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