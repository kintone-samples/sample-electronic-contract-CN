const kintoneApi = require("../../libs/kintoneApi");
const { config } = require("../../config");
const letsignApi = require("../../libs/letsignApi");

exports.inactive = async (recordId) => {
    const contractApp = config.kintone.appInfo.contractApp;
    const userApp = config.kintone.appInfo.userApp;
    const companyApp = config.kintone.appInfo.companyApp;
    const tokens = [contractApp.appToken, userApp.appToken, companyApp.appToken];
    const kintoneApiObj = new kintoneApi(tokens);
    const letsignApiObj = new letsignApi();

    const param = {
        "app": contractApp.appId,
        "id": recordId
    };
    const contractFieldCode = contractApp.fieldCode;
    const { record } = await kintoneApiObj.getRecord(param);
    const contractCode = record[contractFieldCode.contractCode].value;
    const InitiatorId = record[contractFieldCode.InitiatorId].value;
    const inactiveStatus = await letsignApiObj.inactive(contractCode, config.letsign.companyOpenCode, InitiatorId);
    if (inactiveStatus.code === 200) {
        let contractRelatedTable = record[contractFieldCode.contractRelatedTable].value;
        for (let user of contractRelatedTable) {
            let relatedInfo = user.value;
            relatedInfo[contractFieldCode.transactionCode].value = "";
            relatedInfo[contractFieldCode.signUrl].value = "";
        }

        const updataParam = {
            "app": contractApp.appId,
            "id": recordId,
            "record": {
                [contractFieldCode.contractStatus]: {
                    "value": contractApp.contractStatus.inactive
                },
                [contractFieldCode.contractRelatedTable]: {
                    "value": contractRelatedTable
                }
            }
        }
        return kintoneApiObj.updateRecord(updataParam).then(resp => {
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
    return inactiveStatus;
}