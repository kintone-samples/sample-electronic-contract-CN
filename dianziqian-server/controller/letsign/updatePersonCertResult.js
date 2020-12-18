const kintoneApi = require("../../libs/kintoneApi")
const { config } = require("../../config");

exports.updatePersonCertResult = (res) => {
    const userApp = config.kintone.appInfo.userApp;
    let param = {
        "app": userApp.appId,
        "updateKey": {
            "field": userApp.fieldCode.refCode,
            "value": res.refCode
        },
        "record": {
            [userApp.fieldCode.certStatus]: {
                "value": res.certStatus
            }
        }
    }

    const token = userApp.appToken;
    const kintoneApiObj = new kintoneApi(token);
    return kintoneApiObj.updateRecord(param);
}