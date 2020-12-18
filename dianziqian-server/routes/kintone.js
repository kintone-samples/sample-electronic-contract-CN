const express = require('express');
const checkSecret = require('../libs/utils').checkLetsignSecret;
const jwt = require('express-jwt');
const { config } = require("../config");
const upload = require('../controller/kintone/upload').upload;
const applyForSign = require('../controller/kintone/applyForSign').applyForSign;
const archive = require('../controller/kintone/archive').archive;
const inactive = require('../controller/kintone/inactive').inactive;
const getCertUrl = require('../controller/kintone/getCertUrl').getCertUrl;
const getEntCertUrl = require('../controller/kintone/getEntCertUrl').getEntCertUrl;
const queryEntCertProgress = require('../controller/kintone/queryEntCertProgress').queryEntCertProgress;


// const auth = require('../auth');
const router = express.Router()
const jwtSetting = { secret: config.jwt.secret, algorithms: ['HS256'] };

router.get('/testSecret', checkSecret, (req, res) => {
    const a = req.body.test
    res.send(a)
});

router.get('/test', (req, res) => {
    res.send("test")
});

// router.get('/getToken', (req, res) => {
//     const authClass = new auth();
//     authClass.auth(req, res);
// });

router.get('/testToken', jwt(jwtSetting), (req, res) => {
    const a = req.body.test
    res.send(a)
});

router.post('/sendcontract', jwt(jwtSetting), (req, res) => {
    const request = req.body;
    upload(request.recordId).then(resp => {
        res.json(resp)
    }).catch(e => {
        res.json(e)
    });
});

router.post('/sign', jwt(jwtSetting), (req, res) => {
    const request = req.body;
    applyForSign(request.recordId)
        .then(resp => {
            res.json(resp)
        })
        .catch((e) => {
            res.json(e)
        });
});

router.post('/getCertUrl', jwt(jwtSetting), (req, res) => {
    const request = req.body;
    getCertUrl(request.recordId)
        .then(resp => {
            res.json(resp)
        })
        .catch((e) => {
            res.json(e)
        });
});

router.post('/getEntCertUrl', jwt(jwtSetting), (req, res) => {
    const request = req.body;
    getEntCertUrl(request.recordId)
        .then(resp => {
            res.json(resp)
        })
        .catch((e) => {
            res.json(e)
        });
});

router.post('/archive', jwt(jwtSetting), (req, res) => {
    const request = req.body;
    archive(request.recordId)
        .then(resp => {
            res.json(resp)
        })
        .catch((e) => {
            res.json(e)
        });
});

router.post('/inactive', jwt(jwtSetting), (req, res) => {
    const request = req.body;
    inactive(request.recordId)
        .then(resp => {
            res.json(resp)
        })
        .catch((e) => {
            res.json(e)
        });
});

router.post('/queryEntCertProgress', jwt(jwtSetting), (req, res) => {
    const request = req.body;
    queryEntCertProgress()
        .then(resp => {
            res.json(resp)
        })
        .catch((e) => {
            res.json(e)
        });
});

module.exports = router