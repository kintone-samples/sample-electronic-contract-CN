const kintoneApi = require("../../libs/kintoneApi");
const { config } = require("../../config");
const letsignApi = require("../../libs/letsignApi");
const { v1: uuidv1 } = require('uuid');
const sendMail = require('../../libs/sendMail');

exports.getEntCertUrl = async (recordId) => {
    const companyApp = config.kintone.appInfo.companyApp;
    const tokens = [companyApp.appToken];
    const kintoneApiObj = new kintoneApi(tokens);
    const letsignApiObj = new letsignApi();

    const param = {
        "app": companyApp.appId,
        "id": recordId
    };
    const companyFieldCode = companyApp.fieldCode;
    const { record } = await kintoneApiObj.getRecord(param);
    let refCode = record[companyFieldCode.refCode].value ? record[companyFieldCode.refCode].value : uuidv1();
    const refAsyncNotifyUrl = config.letsign.entCertNotifyUrl;
    let letsignparam = [record[companyFieldCode.personOpenCode].value, record[companyFieldCode.companyOpenCode].value, refCode, refAsyncNotifyUrl];

    const getCertUrlStatus = await letsignApiObj.getEntCertUrl(...letsignparam);
    if (getCertUrlStatus.code === 200) {
        let certUrl = getCertUrlStatus.data.url;
        const updataParam = {
            "app": companyApp.appId,
            "id": recordId,
            "record": {
                [companyFieldCode.url]: {
                    "value": certUrl
                },
                [companyFieldCode.refCode]: {
                    "value": refCode
                }
            }
        }

        return kintoneApiObj.updateRecord(updataParam).then(resp => {
            //send email
            let tos = record[companyFieldCode.email].value;
            let subject = "电子牵和kintone的认证";
            let user = record[companyFieldCode.name].value;
            let emailInfo = [user, tos, subject, certUrl, false, "ent"];
            const mail = new sendMail();
            mail.sendCertMail(...emailInfo);
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