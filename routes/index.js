let express = require('express');
let router = express.Router();

let dbo;
require("../congif/db").dbo((db)=>{
    dbo = db;
});

/* GET home page. */
router.get('/', function(req, res) {
    let page = {
      title : "IOU"
    };

    dbo.collection('grades').findOne({student:"Amanda"}, (err, doc) => {
        if (err) throw err;
        res.render('index', { page, doc });
    });

});

module.exports = router;
