const axios = require('axios');
const qs = require('qs');
const fs = require("fs");
const path = require("path");
const { config } = require('../config.js');

class YJSMS {
    templateReplace = (user, certUrl, type = 'person') => {
        let templatePath = type === 'person' ? '../files/smsPersonTemplate.txt' : '../files/smsEntTemplate.txt';
        const templateUrl = path.resolve(__dirname, templatePath);
        let template = fs.readFileSync(templateUrl).toString();
        const userRegexp = /\$\{user\}/;
        const certUrlRegexp = /\$\{certUrl\}/;

        return template.replace(userRegexp, user).replace(certUrlRegexp, certUrl);
    }

    sendCertUrlSMS = (mobile, user, certUrl, type = 'person') => {
        let msg = this.templateReplace(user, certUrl, type);
        return this.sendSMS(mobile, msg);
    }

    sendSMS = (mobile, msg) => {
        let data = {
            "userCode": config.yjsms.userCode,
            "userPass": config.yjsms.userPass,
            "DesNo": mobile,
            "Msg": msg,
            "autograph": "",
            "customerUuid": ""
        };
        let dataObj = qs.stringify(data);
        return axios({
            method: 'post',
            url: config.yjsms.url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: dataObj
        }).then(res => {
            if (res.status == 200) {

            }
        }).catch(res => {
            console.log(res)
        })
    }
}

module.exports = YJSMS

