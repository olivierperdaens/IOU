let conf = require('../congif/config');
let Mongo = require('mongodb');
let MongoClient = Mongo.MongoClient;
let Server = require('mongodb').Server;
let bcrypt = require('bcrypt');

class UserBis{

    constructor(idParam){
        if(idParam === 0){
            this._knownInDatabase = false;
            this._isUpToDated = true;
            this._id = 0;
            this._nom = "";
            this._prenom = "";
            this._email = "";
            this._friends = [];
            this._password = "";
        }
        else{
            MongoClient.connect(conf.db.url, (err, db) => {
                if(err) throw err;
                let dbo = db.db("iou");
                dbo.collection("users").find({_id : Mongo.ObjectId(idParam)}, function (err, data){
                    if(err) throw err;
                    if(data !== null && data !== undefined){
                        this._knownInDatabase = true;
                        this._isUpToDated = true;
                        this._id = data._id;
                        this._nom = data._nom;
                        this._prenom = data._prenom;
                        this._email = data._email;
                    }
                    else{
                        throw new Error("User inconnu !");
                    }
                });
            });
        }
    }

    /**
     * Value is a tab [user, <isConfirmed:True|False>]
     * @param value
     */
    set friends(value) {
        this._friends.push(value);
        this._isUpToDated = false;
    }
    set email(value) {
        this._email = value;
        this._isUpToDated = false;
    }
    set prenom(value) {
        this._prenom = value;
        this._isUpToDated = false;
    }
    set nom(value) {
        this._nom = value;
        this._isUpToDated = false;
    }

    get isUpToDated() {
        return this._isUpToDated;
    }
    get knownInDatabase() {
        return this._knownInDatabase;
    }
    get id(){
        return this._id;
    }
    set password(value){
        if(!this.knownInDatabase) {
            this._password = bcrypt.hashSync(value, 10);
            this._isUpToDated = false;
        }
        else{
            throw new Error("Set password is only allowed for non registred users !");
        }
    }


    /**
     *
     * @returns {*}
     */
    get friends(){
        let tabReturn = [this._friends.length][2];
        for(let i=0; i<this._friends.length; i++){
            tabReturn.push([new UserBis(this._friends[i]._id), this._friends.confirmed]);
        }
        return tabReturn;
    }

    isUserConnected(session, cb){
        if(this._email === session.email) {
            this.isCorrectPassword(session.password, (res)=>{
                cb(res);
            })
        }
        else{
            cb(false);
        }
    }

    isCorrectPassword(pass, cb){
        if(this._knownInDatabase){
            MongoClient.connect(conf.db.url, (err, db)=>{
                if(err) throw err;
                let dbo = db.db('iou');
                dbo.collection("users").find({_id: Mongo.ObjectId(this._id)}, (err, data)=>{
                    bcrypt.compare(pass, data.password, (err, res)=>{
                        if(err) throw err;
                        console.log('password check', res);
                        cb(res);
                    })
                });
            });
        }
        else{
            throw new Error("User is not registred into database ! Impossible to compare password !");
        }
    }

    changePassword(session, newPassword){
        this.isUserConnected(session, (result)=>{
           if(result){
               //TODO change password
           }
           else{
               throw new Error("You are not allowed to change someone else's password !");
           }
        });
    }

    async saveUser(){
        let self = this;
        if(this._knownInDatabase && !this._isUpToDated) {
            this.updateDatabase().then(()=>{
                self._isUpToDated = true;
            });
        }
        else if(!this._knownInDatabase && !this._isUpToDated){
            let newID = await this.createInDatabase();
            self._id = newID;
            self._knownInDatabase = true;
            self._isUpToDated = true;
            return true;
        }
        else{
            throw new Error("User is already upToDated, no need to save !");
        }
    }

    updateDatabase(){
        //TODO update les champs dans la base de donnée
    }

    async createInDatabase(){
        if(this._email != null && this._password != null && this._nom != null && this._prenom != null && this._password !== ""){

            let objToInsert = {
                nom : this._nom,
                prenom : this._prenom,
                email : this._email,
                password : this._password,
                friends : this._friends
            };

            //TODO check user not existing before

            let db = await conf.db.open();
            let users = await db.db('iou').collection('users');
            let result = await users.insertOne(objToInsert);
            conf.db.close(db);
            return result.ops[0]._id;

        }
        else{
            throw new Error("All attibutes must be non null before adding a user to the database !");
        }
    }

    async deleteUser(){
        if(this.knownInDatabase){
            let self = this;
            let objToRemove = {_id: Mongo.ObjectId(self._id)};
            let db = await conf.db.open();
            let users = await db.db('iou').collection('users');
            let result = await users.deleteOne(objToRemove);
            return result.deletedCount;
        }
        else{
            throw new Error("Could not delete unsaved user !");
        }
    }

}

module.exports = UserBis;