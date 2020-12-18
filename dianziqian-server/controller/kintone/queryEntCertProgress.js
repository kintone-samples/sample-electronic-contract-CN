const letsignApi = require("../../libs/letsignApi");

exports.queryEntCertProgress = async () => {

    const letsignApiObj = new letsignApi();
    let companyCode = "abc";
    let urlcode = "a699d00e577d44cd9214ab33fd815aff";
    let personOpenCode = "abc1";
    const inactiveStatus = await letsignApiObj.queryEntCertProgress(personOpenCode,companyCode,urlcode);
    console.log(inactiveStatus);
    return inactiveStatus;
}