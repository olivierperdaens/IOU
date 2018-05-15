mongoClient = require('mongodb').MongoClient;

module.exports = {
    db:{
        url : "mongodb://localhost:27017" ,
        open:
            function open(){
                // Connection URL. This is where your mongodb server is running.
                let url = "mongodb://localhost:27017";
                return new Promise((resolve, reject)=>{
                    // Use connect method to connect to the Server
                    mongoClient.connect(url, (err, db) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(db);
                        }
                    });
                });
            },
        close:
            function close(db){
                //Close connection
                if(db){
                    db.close();
                }
            }
    },
    connectedUser : {}
};