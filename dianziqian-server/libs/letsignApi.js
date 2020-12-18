const axios = require("axios");
const FormData = require("form-data");
const utils = require("./utils");
const { config } = require('../config.js');
const letsign = config.letsign;

class letsignApi {
    /**
     * 基础参数
     */
    baseParam() {
        return {
            "appCode": letsign.appCode,
            "version": "v1",
            "timestamp": Date.now()
        };
    }

    /**
     * 
     * @param {*} type 
     */
    postUrl(api, isFile = false, data) {
        if (!api in letsign.apiList) return;
        let options =
        {
            method: "POST",
            url: letsign.apiList[api],
            baseURL: letsign.baseUrl,
            headers: isFile ? { ...data.getHeaders() } : { "Content-Type": "application/json" },
            data: data
        }

        return axios(options).then(res => {
            if (res.status === 200 && res.data.code == 0) {
                return {
                    'code': 200,
                    'data': res.data.data
                }
            }
            else {
                return {
                    'code': 500,
                    'data': res.data.description
                }
            }
        }).catch(e => {
            return {
                'code': 500,
                'data': '失败'
            }
        })
    }

    /**
     * 签名
     * @param {*} data 
     * @param {*} api 
     */
    makeSign(data, api) {
        let newData = utils.ksort(data);
        let string = utils.toUrlParams(newData, letsign.apiList[api]);
        string = string + letsign.appSecret;
        let result = utils.encode("sha1", string);
        return result;
    }


    /**
     * 上传模板
     * @param {*} file 
     * @param {*} filename 
     */
    uploadTemplate(file, filename) {
        let api = 'uploadTemplate';
        let param = {
            ...this.baseParam(),
            "companyOpenCode": "1",
            "contractCode": "1",
            "personOpenCode": "1",
            "signTypeLimits": "",
            "signValidMethod": ""
        };
        let token = this.makeSign(param, api);

        const form = Object.entries(param).reduce((formdata, [key, value]) => {
            formdata.append(key, value);
            return formdata;
        }, new FormData());

        form.append("token", token);
        form.append("templateFile", file, {
            filename,
            contentType: "application/pdf"
        });

        return this.postUrl(api, true, form);
    }

    /**
     * 文件上传
     * @param {*} file 
     * @param {*} filename 
     */
    upload(file, filename, companyOpenCode, personOpenCode) {
        let api = 'upload';
        let param = {
            ...this.baseParam(),
            "companyOpenCode": companyOpenCode,
            "personOpenCode": personOpenCode
        };
        let token = this.makeSign(param, api);

        const form = Object.entries(param).reduce((formdata, [key, value]) => {
            formdata.append(key, value);
            return formdata;
        }, new FormData());

        form.append("token", token);
        form.append("contractFile", file, {
            filename,
            contentType: "application/pdf"
        });
        return this.postUrl(api, true, form);
    }

    /**
     * 文件撤销
     */
    inactive(contractCode, companyOpenCode, personOpenCode) {
        const api = 'inactive';
        let param = {
            ...this.baseParam(),
            "contractCode": contractCode,
            "companyOpenCode": companyOpenCode,
            "personOpenCode": personOpenCode
        };
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }

    getCertUrl(personOpenCode, personMobile, refCode, refAsyncNotifyUrl) {
        const api = 'getCertUrl';
        let param = {
            ...this.baseParam(),
            "personOpenCode": personOpenCode,
            "personMobile": personMobile,
            "refCode": refCode,
            "refAsyncNotifyUrl": refAsyncNotifyUrl
        };
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }

    getEntCertUrl(personOpenCode, companyOpenCode, refCode, refAsyncNotifyUrl) {
        const api = 'getEntCertUrl';
        let param = {
            ...this.baseParam(),
            "personOpenCode": personOpenCode,
            "companyOpenCode": companyOpenCode,
            "refCode": refCode,
            "refAsyncNotifyUrl": refAsyncNotifyUrl
        };
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }

    /**
     *  手动签署
     */
    applyForSign(contractCode, transactionCode, personOpenCode, keyWord, companyOpenCode) {
        const api = 'applyForSign';
        let param = {
            ...this.baseParam(),
            "contractCode": contractCode,
            "personOpenCode": personOpenCode,
            "signTypeLimits": "10",
            "signValidMethod": 3,
            "keyWord": keyWord,
            "transactionCode": transactionCode,
            "needMessage": 2,
            "needVerification": 0
        };
        if (companyOpenCode) param.companyOpenCode = companyOpenCode;
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }

    /**
    *  自动签署
    */
    autoSign(contractCode, transactionCode, personOpenCode, keyWord, companyOpenCode, signatureCode) {
        const api = 'autoSign';
        let param = {
            ...this.baseParam(),
            "contractCode": contractCode,
            "personOpenCode": personOpenCode,
            "keyWord": keyWord,
            "signatureCode": signatureCode,
            "transactionCode": transactionCode
        };
        if (companyOpenCode) param.companyOpenCode = companyOpenCode;
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }

    /**
     *  归档
     */
    archive(contractCode, personOpenCode) {
        const api = 'archive';
        let param = {
            ...this.baseParam(),
            "contractCode": contractCode,
            "personOpenCode": personOpenCode
        };
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }

    queryEntCertProgress(personOpenCode, companyOpenCode, urlCode) {
        const api = 'queryEntCertProgress';
        let param = {
            ...this.baseParam(),
            "personOpenCode": personOpenCode,
            "companyOpenCode": companyOpenCode,
            "urlCode": urlCode
        };
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }

    /**
     *  转短链
     */
    getShortUrl(longUrl) {
        const api = 'longUrl';
        let param = {
            ...this.baseParam(),
            "longUrl": longUrl
        };
        let token = this.makeSign(param, api);
        param['token'] = token;
        return this.postUrl(api, false, param);
    }
}

module.exports = letsignApi