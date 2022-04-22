const { application } = require('express');
var express = require('express');
var router = express.Router();
var db = require('../model/db.config.js');
var fs = require('fs');

router.get('/', (req, res, next) => {
    res.render("backend");
});


router.post('/insertERC1155Token', (req, res, next) => {
    console.log("deployERC1155");
    let param = [req.body.contractAddr, req.body.tokenID, req.body.title + "學習時數", "credit_hours"];
    db.insert1155(param, (result) => {
        res.send(result);
    });
});

router.post('/deployERC721', (req, res, next) => {

    let param = [req.body.contractAddr, req.body.Ctitle, req.body.Clevel, req.body.erc1155Addr, req.body.erc1155Token, req.body.fileName];
    db.insert721(param, (result) => {
        generateFolder(req.body.baseURI);
        res.send("success");
    });
});

function generateFolder(baseURI) {
    let dir = 'public/' + baseURI;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("folder generated!");
    }
}


module.exports = router;