

function registerCompare () {

    var pass1 = document.getElementById("registerPassword2");
    var pass2 = document.getElementById("registerPassword2");


        if(pass1.value != pass2.value) {
            alert("Les mots de passe ne sont pas identiques!");
            console.log("yo");
            return false;
        } else {
            document.getElementById('register_form')[0].submit();
            alert("submitted");
            return true;
        }
}

