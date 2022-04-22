const { application } = require('express');
var express = require('express');
var router = express.Router();
var db = require('../model/db.config.js');
var fs = require('fs');

router.get('/', (req, res, next) => {
    res.render('frontend');
});

router.get('/results1155', (req, res, next) => {
    db.select1155([], (results1155) => {
        res.send(results1155);
    });
});

router.get('/results721', (req, res, next) => {
    db.select721([], (results721) => {
        res.send(results721);
    })
});


// 待調整res.send，若某function壞掉則return 錯誤
router.post('/makefile', (req, res, next) => {
    let baseURI = req.body.baseURI;
    let tokenID = req.body.tokenID;
    let to = req.body.to;
    let type = req.body.type;

    generateJSONfile(baseURI, tokenID, to);
    // type => fileName
    generateJPG(baseURI, tokenID, type);
    res.send("Done");
});


function generateJSONfile(baseURI, tokenID, to) {

    let info = getJSONInfo(baseURI, tokenID, to);

    fs.writeFile("public/" + baseURI + tokenID + ".json", JSON.stringify(info), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(tokenID + ".json generated!");
        }
    });
}

function getJSONInfo(baseURI, tokenID, to) {
    return {
        "title": "Certificates Metadata",
        "owner": to,
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "Identifies the asset to which this NFT represents"
            },
            "description": {
                "type": "string",
                "description": "CKA certificate for " + to
            },
            "image": {
                "type": "string",
                "URL": "http://localhost:3000/" + baseURI + tokenID + ".jpg"
            }
        }
    }
}


function generateJPG(baseURI, tokenID, type) {

    let sample = type.toLowerCase();
    console.log("log : " + baseURI, tokenID, type);
    fs.readFile("public/images/" + sample + ".jpg", function (err, originBuffer) {            //讀取圖片位置（路徑）
        if (err) {
            console.log(err);
            return;
        };
        fs.writeFile("public/" + baseURI + tokenID + ".jpg", originBuffer, function (err) {      //生成圖片2(把buffer寫入到圖片檔案)
            if (err) {
                console.log(err)
            }
        });
    });
}


module.exports = router;