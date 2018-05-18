let User = require('../model/user');

class friendPredictor{

static getPredictorCount(currentUserId, cb){
    let self = this;
    console.log("initiating predictor");
    User.getFriendsListPredictor( currentUserId , function (friendsList){
        let doubleTab = [];

        for(let i=0; i<friendsList.length && doubleTab.length < friendsList.length; i++){
            User.getFriendsListPredictor(friendsList[i]._id, function(friendFriendList){

                console.log("getting friends for " + friendsList[i].nom + "" + i);
                doubleTab[i]=[friendFriendList];
                if(i===friendFriendList.length-1){
                    console.log("here");
                    cb(self.probabilityFinder(doubleTab));
                }
            });
        }


    });
}

static  probabilityFinder( friendMatrix  ){

    let baseArray = friendMatrix[0].slice(); //copy of array instead of reference
    let baseArrayLink = [];
    let self = this;
    //copies the first array to to base

    for (let i = 1 ; i < friendMatrix[i].length ; i++){
        for( let j =0 ; j < friendMatrix[i][j].length; j++ ){
            let inList = 0;
            for (let k = 0 ; j < baseArray.length || !inList ; k++){

                    if(friendMatrix[i][j]._id === baseArray[k]._id   ){
                        baseArrayLink[k] = (baseArrayLink[k] || 0) + 1;
                        console.log(baseArray[k]._nom + "found " + baseArrayLink[k]+ "times");
                        //either initialises element in position k or increments it
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

    return self.unMap(self.slicer(self.mapTuple( baseArrayLink, baseArray)));
    //points first , users objects second

}

static unMap( tupleArray ){
    let finalArray = [];

    for (let i = 0 ; i < tupleArray.length ; i++){
        finalArray[i]= tupleArray[i][1];
    }

    for(let i = 0 ; i < finalArray.length ; i ++){
        console.log(finalArray[i].nom);
    }
    return finalArray;
    //todo returns an array of user objects without point linked to it
}

static mapTuple (linkArray , userArray ){
    let tupleArray= [];
    for (let i = 0 ; i < linkArray.length ; i++){
        tupleArray[i] = [linkArray[i],userArray[i]];
    }

    return tupleArray;
}

//merge sorting based on attributed points
 static slicer( tupleArray ){
     let self = this;
    if(tupleArray.length === 1){
        return tupleArray
    }

    let slice= tupleArray.length/2;
    let left = tupleArray.slice(0, slice);
     let right = tupleArray.slice(slice, tupleArray.length);

     return self.mergeArray(self.slicer(left) , self.slicer(right));

}

static mergeArray(tupleArray1,tupleArray2){

    let tupleOut = [];

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

}
module.exports = friendPredictor;