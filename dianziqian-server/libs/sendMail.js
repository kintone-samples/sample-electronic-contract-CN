const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const fs = require("fs");
const path = require("path");
const { config } = require('../config.js');

class sendMail {
    templateReplace = (user, certUrl, type = 'person') => {
        let templatePath = type === 'person' ? '../files/emailPersonTemplate.html' : '../files/emailEntTemplate.html';
        const templateUrl = path.resolve(__dirname, templatePath);
        let template = fs.readFileSync(templateUrl).toString();
        const userRegexp = /\$\{user\}/;
        const certUrlRegexp = /\$\{certUrl\}/;

        return template.replace(userRegexp, user).replace(certUrlRegexp, certUrl);
    }
    sendCertMail = async (user, tos, subject, certUrl, qr = false, type = 'person') => {
        const from = config.mail.from;
        const aliasName = config.mail.aliasName;

        const smtpTransport = nodemailer.createTransport({
            host: config.mail.host,
            secureConnection: true, // use SSL
            secure: true,
            port: config.mail.port,
            auth: {
                user: config.mail.from,
                pass: config.mail.password,
            }
        });
        let emailInfo = this.templateReplace(user, certUrl, type);
        let htmlMsg = `${emailInfo}`;
        let mailOption = {
            from: aliasName + ' ' + '<' + from + '>',
            to: tos,
            subject: subject
        };
        if (qr) {
            const cid = '001';
            const src = path.resolve(__dirname, '../files/qrcode.png');
            htmlMsg += `<br><img src="cid:${cid}"/>`;
            await QRCode.toFile(src, certUrl);
            mailOption.attachments = [
                {
                    filename: 'qrcode.png',
                    path: src,
                    cid: cid
                }
            ]
        }
        mailOption.html = htmlMsg;
        smtpTransport.sendMail(mailOption, function (err, res) {
            if (err) {
                console.log('error: ', err);
            }
        });
    }
}
module.exports = sendMail
