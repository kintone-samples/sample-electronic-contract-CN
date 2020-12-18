const kintoneApi = require("../../libs/kintoneApi")
const { config } = require("../../config");
const utils = require("../../libs/utils");

const contractApp = config.kintone.appInfo.contractApp;
const userApp = config.kintone.appInfo.userApp;
const companyApp = config.kintone.appInfo.companyApp;
const contractFieldCode = contractApp.fieldCode;

let updataSignData = (signData, table) => {
   let transactionCode = signData.transactionCode;
   for (let v of table) {
      let relatedInfo = v.value;
      if (relatedInfo[contractFieldCode.transactionCode].value === transactionCode) {
         relatedInfo[contractFieldCode.status].value = signData.resultCode ? contractApp.signStatus.signed : contractApp.signStatus.notSigned;
         relatedInfo[contractFieldCode.resultDesc].value = signData.resultDesc;
         relatedInfo[contractFieldCode.downloadUrl].value = utils.formatTokintoneLink(signData.downloadUrl, '链接');
         relatedInfo[contractFieldCode.viewPdfUrl].value = utils.formatTokintoneLink(signData.viewPdfUrl, '链接');
         break;
      }
   }
   return table;
}

exports.signSuccess = async (signData) => {
   const reg = /[^-]*/;
   let transactionCode = signData.transactionCode;
   const recordId = transactionCode.match(reg)[0];

   const tokens = [contractApp.appToken, userApp.appToken, companyApp.appToken];

   const param = {
      "app": contractApp.appId,
      "id": recordId
   };
   const kintoneApiObj = new kintoneApi(tokens);
   let { record } = await kintoneApiObj.getRecord(param).catch(e => {
      return Promise.reject(e);
   });
   let contractRelatedTable = record[contractFieldCode.contractRelatedTable].value;
   updataSignData(signData, contractRelatedTable);

   const updataParam = {
      "app": contractApp.appId,
      "id": recordId,
      "record": {
         [contractFieldCode.contractRelatedTable]: {
            "value": contractRelatedTable
         },
         [contractFieldCode.contractStatus]: {
            "value": contractApp.contractStatus.signing
         }
      }
   }
   return kintoneApiObj.updateRecord(updataParam).catch(e => {
      return Promise.reject(e);
   });
}
