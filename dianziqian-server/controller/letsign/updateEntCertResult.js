const kintoneApi = require("../../libs/kintoneApi")
const { config } = require("../../config");

exports.updateEntCertResult = (res) => {
    const companyApp = config.kintone.appInfo.companyApp;
    let param = {
        "app": companyApp.appId,
        "updateKey": {
            "field": companyApp.fieldCode.refCode,
            "value": res.refCode
        },
        "record": {
            [companyApp.fieldCode.personCertStatus]: {
                "value": res.personCertResult.certStatus
            },
            [companyApp.fieldCode.companyCertStatus]: {
                "value": res.entCertResult.certStatus
            },
            [companyApp.fieldCode.personBindOpenCodeSuccess]: {
                "value": res.personCertResult.bindOpenCodeSuccess
            },
            [companyApp.fieldCode.companyBindOpenCodeSuccess]: {
                "value": res.entCertResult.bindOpenCodeSuccess
            }
        }
    }

    const token = companyApp.appToken;
    const kintoneApiObj = new kintoneApi(token);
    return kintoneApiObj.updateRecord(param);
}