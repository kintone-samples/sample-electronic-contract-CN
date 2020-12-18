const kintoneApi = require("../../libs/kintoneApi");
const { config } = require("../../config");
const letsignApi = require("../../libs/letsignApi");
const utils = require("../../libs/utils");

exports.upload = async (recordId) => {
    const contractApp = config.kintone.appInfo.contractApp;
    const userApp = config.kintone.appInfo.userApp;
    const companyApp = config.kintone.appInfo.companyApp;
    const tokens = [contractApp.appToken, userApp.appToken, companyApp.appToken];
    const kintoneApiObj = new kintoneApi(tokens);
    const letsignApiObj = new letsignApi();
    const contractFieldCode = contractApp.fieldCode;
    const param = {
        "app": contractApp.appId,
        "id": recordId
    };
    const { record } = await kintoneApiObj.getRecord(param);
    const initiatorId = record[contractFieldCode.InitiatorId].value;
    const InitiatorCompanyCode = record[contractFieldCode.InitiatorCompanyCode].value;
    const file = record[contractFieldCode.file].value;

    if (file.length === 0) {
        return {
            'code': 500,
            'data': "请先准备合同"
        }
    }
    const fileKey = file[0].fileKey;
    const buffer = await kintoneApiObj.getFile(fileKey);
    const uploadResult = await letsignApiObj.upload(utils.bufferToStream(buffer), file[0].name, InitiatorCompanyCode, initiatorId);
    if (uploadResult.code !== 200) {
        return uploadResult;
    }

    const updataParam = {
        ...param,
        "record": {
            [contractFieldCode.contractStatus]: {
                "value": contractApp.contractStatus.uploaded
            },
            [contractFieldCode.contractCode]: {
                "value": uploadResult.data.contractCode
            }
        }
    };
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