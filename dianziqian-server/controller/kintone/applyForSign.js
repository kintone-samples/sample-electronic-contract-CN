const kintoneApi = require("../../libs/kintoneApi");
const { config } = require("../../config");
const letsignApi = require("../../libs/letsignApi");
const { v4: uuidv4 } = require('uuid');
const utils = require("../../libs/utils");

exports.applyForSign = async (recordId) => {
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
    let contractRelatedTable = record[contractFieldCode.contractRelatedTable].value;
    const initiatorIdSignKey = record[contractFieldCode.initiatorIdSignKey].value;
    const initiatorId = record[contractFieldCode.InitiatorId].value;
    const InitiatorCompanyCode = record[contractFieldCode.InitiatorCompanyCode].value;
    const InitiatorSearch = record[contractFieldCode.InitiatorSearch].value;
    //循环合同关系者 发起手动签署  如果用户手动添加了合同发起人到合同关系人中，那就以手动的方式来让发起人签署
    let needInitiator = true;
    let errorInfo = {};
    let contractStatus = contractApp.contractStatus.startSign;
    for (let user of contractRelatedTable) {
        let relatedInfo = user.value;

        let companyOpenCode = relatedInfo[contractFieldCode.companyOpenCode].value;
        let personOpenCode = '';
        if (companyOpenCode) {
            personOpenCode = relatedInfo[contractFieldCode.entPersonOpenCode].value;
        }
        else {
            personOpenCode = relatedInfo[contractFieldCode.personOpenCode].value;
        }
        let signKey = relatedInfo[contractFieldCode.signKey].value;

        //判断是否将发起人加入了进来。
        if (personOpenCode === initiatorId && companyOpenCode === InitiatorCompanyCode) needInitiator = false;
        //判断是否已签
        if (relatedInfo[contractFieldCode.status].value === contractApp.signStatus.signed) {
            contractStatus = contractApp.contractStatus.signing;
            continue;
        };
        //判断已经发送过签署请求（transactionCode）
        let transactionCode = relatedInfo[contractFieldCode.transactionCode].value ? relatedInfo[contractFieldCode.transactionCode].value : `${recordId}-${uuidv4()}`;
        let options = [contractCode, transactionCode, personOpenCode, signKey, companyOpenCode];
        let signResult = await letsignApiObj.applyForSign(...options);
        if (signResult.code !== 200) {
            errorInfo = signResult;
            continue;
            // return signResult;
        }
        relatedInfo[contractFieldCode.signUrl].value = utils.formatTokintoneLink(signResult.data.signUrl, '签署链接');
        relatedInfo[contractFieldCode.transactionCode].value = transactionCode;
    }

    //发起自动签署 将合同发起者自动添加到合同表 因为怕循环里同时生成的时间戳会一样，所以用v4随机数
    if (needInitiator) {
        contractStatus = contractApp.contractStatus.signing;
        const InitiatorTransactionCode = `${recordId}-${uuidv4()}`;
        const companySignatureCode = config.letsign.companySignatureCode;
        const autoSignResult = await letsignApiObj.autoSign(contractCode, InitiatorTransactionCode, initiatorId, initiatorIdSignKey, InitiatorCompanyCode, companySignatureCode);
        if (autoSignResult.code !== 200) {
            errorInfo = autoSignResult;
            // return autoSignResult;
        }
       
        const InitiatorInfo = {
            value: {
                [contractFieldCode.companySearch]: {
                    value: InitiatorSearch
                },
                [contractFieldCode.signKey]: {
                    value: initiatorIdSignKey
                },
                [contractFieldCode.signUrl]: {
                    value: contractApp.signStatus.autoSigned
                },
                [contractFieldCode.transactionCode]: {
                    value: InitiatorTransactionCode
                },
                [contractFieldCode.status]: {
                    value: contractApp.signStatus.notSigned
                }
            }
        }
        contractRelatedTable.push(InitiatorInfo);
    }

    //更新合同关系表
    const updataParam = {
        "app": contractApp.appId,
        "id": recordId,
        "record": {
            [contractFieldCode.contractRelatedTable]: {
                "value": contractRelatedTable
            },
            [contractFieldCode.contractStatus]: {
                "value": contractStatus
            }
        }
    }

    return kintoneApiObj.updateRecord(updataParam).then(resp => {
        var arr = Object.keys(errorInfo);
        if (arr.length != 0) {
            return errorInfo;
        } else {
            return {
                'code': 200,
                'data': resp
            }
        }
    }).catch(err => {
        return {
            'code': 500,
            'data': err.message
        }
    })
}