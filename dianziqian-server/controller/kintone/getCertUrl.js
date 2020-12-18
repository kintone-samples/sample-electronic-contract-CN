const kintoneApi = require("../../libs/kintoneApi");
const { config } = require("../../config");
const letsignApi = require("../../libs/letsignApi");
const { v1: uuidv1 } = require('uuid');
const sendMail = require('../../libs/sendMail');
const YJSMS = require('../../libs/YJSMS');

exports.getCertUrl = async (recordId) => {
    const userApp = config.kintone.appInfo.userApp;
    const tokens = [userApp.appToken];
    const kintoneApiObj = new kintoneApi(tokens);
    const letsignApiObj = new letsignApi();

    const param = {
        "app": userApp.appId,
        "id": recordId
    };
    const userFieldCode = userApp.fieldCode;
    const { record } = await kintoneApiObj.getRecord(param);
    let refCode = record[userFieldCode.refCode].value ? record[userFieldCode.refCode].value : uuidv1();
    const refAsyncNotifyUrl = config.letsign.personCertNotifyUrl;
    let letsignparam = [record[userFieldCode.userId].value, record[userFieldCode.mobile].value, refCode, refAsyncNotifyUrl];

    const getCertUrlStatus = await letsignApiObj.getCertUrl(...letsignparam);
    if (getCertUrlStatus.code === 200) {
        let certUrl = getCertUrlStatus.data.url;
        const updataParam = {
            "app": userApp.appId,
            "id": recordId,
            "record": {
                [userFieldCode.url]: {
                    "value": certUrl
                },
                [userFieldCode.refCode]: {
                    "value": refCode
                }
            }
        }

        return kintoneApiObj.updateRecord(updataParam).then(resp => {
            //send email
            let tos = record[userFieldCode.email].value;
            let subject = "电子牵和kintone的认证";
            let user = record[userFieldCode.name].value;
            let emailInfo = [user, tos, subject, certUrl, "person"];
            const mail = new sendMail();
            mail.sendCertMail(...emailInfo);

            //send sms
            let smsInfo = [record[userFieldCode.mobile].value, record[userFieldCode.name].value, certUrl, true, 'person'];
            let yjSMS = new YJSMS();
            yjSMS.sendCertUrlSMS(...smsInfo);

            return {
                'code': 200,
                'data': resp
            }
        }).catch(err => {
            return {
                'code': 500,
                'data': err.message
            }
        })
    }
    return getCertUrlStatus;
}