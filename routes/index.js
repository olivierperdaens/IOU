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
        if (err) throw err;
        let dbo = db.db("iou");
        dbo.collection('grades').findOne({student: "Amanda"}, (err, doc) => {
            if (err) throw err;
            res.render('index', {page, doc});
        });
        db.close();
    });
});

module.exports = router;
