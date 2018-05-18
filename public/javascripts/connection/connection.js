$("#saveNewAccount").on("click", function(event){
    event.preventDefault();
   let pass1 = $("#registerPassword").val();
   let pass2 = $("#registerPassword2").val();

   if(pass1.localeCompare(pass2) === 0){
       $("#register_form").submit();
   }
   else{
       alert("Les deux mots de passent ne concordent pas !");
   }
});

