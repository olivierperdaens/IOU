$(".showHistory").on("click", function(){
    let id_other_user = $(this).attr("id_other_user");
    console.log(id_other_user);

    $.ajax({
       url : "/getDebtHistory",
       type : "post",
       dataType : "json",
       data: "id_user="+id_other_user,
       success : function(data){
           $.ajax({
               url : "/profile/getInfoUser",
               type: "post",
               dataType: "json",
               data : "id_user=" + id_other_user,
               success : function(UserInfo){
                   let html = "<ul class='list-group'>";
                   for(let i=0; i<data.length; i++){
                       let classe = "";
                       if(id_other_user === data[i].id_debt_sender){
                           classe = "list-group-item-danger";
                       }
                       else{
                           classe = "list-group-item-success";
                       }
                       html += "<li class='list-group-item " + classe + "'>";
                       html += data[i].date.substring(0, 10) + " <b style='float: right'>" + data[i].ammount + "€</b> <br>";
                       html += "<i>" + data[i].description + "</i>";
                       html += "</li>";
                   }
                   html += "</ul>";
                   $("#modalHistoriqueTitle").html("Historique des dettes avec <b>" + UserInfo.prenom + " " + UserInfo.nom + "</b>");
                   $("#modalHistoriqueBody").html(html);
                   $("#modalHistorique").modal("show");
               }
           })
       }
    });

});
