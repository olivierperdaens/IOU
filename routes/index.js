let express = require('express');
let router = express.Router();
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;

/* GET home page. */
router.get('/', function(req, res) {
    let page = {
      title : "IOU"
    };
    MongoClient.connect('mongodb://localhost:27017', (err, db) => {
        let dbo = db.db("course");
        if (err) throw err;
        dbo.collection('grades').findOne({student:"Amanda"}, (err, doc) => {
            if (err) throw err;
            res.render('index', { page, doc });
        });
    });

});


module.exports = router;
