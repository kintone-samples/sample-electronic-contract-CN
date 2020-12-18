const express = require('express');
const checkSecret = require('../libs/utils').checkLetsignSecret;
const router = express.Router()
const { updatePersonCertResult } = require('../controller/letsign/updatePersonCertResult');
const { signSuccess } = require('../controller/letsign/signSuccess');
const { updateEntCertResult } = require('../controller/letsign/updateEntCertResult');

router.get('/test', checkSecret, (req, res) => {
    res.send("callbacktest")
});

router.post('/updatePersonCertResult', (req, res) => {
    const request = req.body;
    updatePersonCertResult(request)
        .then(resp => { res.json(resp) })
        .catch((e) => {
            res.json(e)
        });
});

router.post('/updateEntCertResult', (req, res) => {
    const request = req.body;
    updateEntCertResult(request)
        .then(resp => { res.json(resp) })
        .catch((e) => {
            res.json(e)
        });
});

router.post('/signsuccess', checkSecret, (req, res) => {
    const request = req.body;
    signSuccess(request)
        .then(resp => {
            res.json(resp)
        })
        .catch((e) => {
            res.json(e)
        });
});

module.exports = router