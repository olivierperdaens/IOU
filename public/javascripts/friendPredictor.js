function  probabilityFinder( friendMatrix  ){
    var baseArray = friendMatrix[0].slice();
    var baseArrayLink = [];


    //copies the first array to to base

    for (var i = 1 ; i < friendMatrix[i].length ; i++){
        for( var j =0 ; j < friendMatrix[i][j].length; j++ ){
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

    return slicer(mapTuple(baseArray, baseArrayLink));


}

function unMap( tupleArray ){
    //todo returns an array of user objects without point linked to it 
}

function mapTuple (linkArray , userArray ){
    var tupleArray= [];
    for (var i = 0 ; i < linkArray.length ; i++){
        tupleArray[i] = [linkArray[i],userArray[i]];
    };
    return tupleArray;
    //todo maps 2 arrays of the same size to make tuple
}


    //todo merge sort

 function slicer( tupleArray ){

    if(tupleArray.length === 1){
        return tupleArray
    }

    var slice= tupleArray.length/2;
    var left = tupleArray.slice(0, slice);
     var right = tupleArray.slice(slice, tupleArray.length);

     return merger(slicer(left) , slicer(right));

}

function merger(tupleArray1,tupleArray2){

    var tupleOut = [];

    while(tupleArray1.length > 0 && tupleArray2.length > 0) {

        if(tupleArray1[0][0] <= tupleArray2[0][0]){
            tupleOut.push(tupleArray1.shift()); //removes 1st element of the list
        }
        else{
            tupleOut.push(tupleArray2.shift());
        }


    }


    //push left over of the list full list
    while (tupleArray1.length > 1){
        tupleOut.push(tupleArray1.shift());
    }

    while (tupleArray2.length > 1){
        tupleOut.push(tupleArray2.shift());
    }

    return tupleOut;


}

