function  probabilityFinder( friendMatrix  ){
    var baseArray = friendMatrix[0].slice();
    var baseArrayLink = [];


    //copies the first array to to base

    for (var i = 1 ; i < friendMatrix[0].length ; i++){
        for( var j =0 ; j < friendMatrix[i].length; j++ ){
            var inList = 0;
            for (var k = 0 ; j < baseArray.length || !inList ; k++){
                    //TODO write comparator
                    if(friendMatrix[i][j] === baseArray[k]  ){
                        baseArrayLink[k] = (baseArrayLink[k] || 0) + 1;

                        //either initialises element in position k or incerements it
                        inList = 1;
                    }
            }
            //adds to list
            if(!inList){
                //adds friend to list
                baseArray.push(friendMatrix[i][j]);
                baseArrayLink.push(0);
            }
        }
    }

}


    //todo merge sort

 function slicer(linkArray , userArray ){

}

function merger(linkArray1 , userArray1, linkArray2 , userArray2){


}

