exports.config = {
    "kintone": {
        "domain": "https://e-contract.cybozu.cn",
        "appInfo": {
            "userApp": {
                "appName": "用户管理",
                "appId": 7,
                "appToken": "xxxxx",
                "fieldCode":
                {
                    "userId": "userId",
                    "name": "name",
                    "mobile": "mobile",
                    "refCode": "refCode",
                    "url": "url",
                    "email": "email",
                    "certStatus": "certStatus"
                }
            },
            "companyApp": {
                "appName": "企业用户管理",
                "appId": 9,
                "appToken": "xxx",
                "fieldCode":
                {
                    "companyOpenCode": "companyOpenCode",
                    "personOpenCode": "personOpenCode",
                    "refCode": "refCode",
                    "url": "url",
                    "email": "email",
                    "personCertStatus": "personCertStatus",
                    "companyCertStatus": "companyCertStatus",
                    "personBindOpenCodeSuccess": "personBindOpenCodeSuccess",
                    "companyBindOpenCodeSuccess": "companyBindOpenCodeSuccess",
                    "name": "name"
                }
            },
            "contractApp": {
                "appName": "合同管理",
                "appId": 8,
                "appToken": "xxxx",
                "signStatus": {
                    "signed": "已签",
                    "notSigned": "未签",
                    "autoSigned": "自动签署"
                },
                "contractStatus": {
                    "notUpload": "未上传",
                    "uploaded": "已上传",
                    "startSign": "已发起签署",
                    "signing": "签署中",
                    "inactive": "已撤销",
                    "archive": "已归档"
                },
                "fieldCode":
                {
                    "contractRelatedTable": "contractRelatedTable",
                    "personOpenCode": "personOpenCode",
                    "signUrl": "signUrl",
                    "transactionCode": "transactionCode",
                    "contractCode": "contractCode",
                    "InitiatorId": "InitiatorId",
                    "InitiatorName": "InitiatorName",
                    "username": "username",
                    "status": "status",
                    "file": "file",
                    "resultDesc": "resultDesc",
                    "downloadUrl": "downloadUrl",
                    "viewPdfUrl": "viewPdfUrl",
                    "contractStatus": "contractStatus",
                    "signKey": "signKey",
                    "initiatorIdSignKey": "initiatorIdSignKey",
                    "companyOpenCode": "companyOpenCode",
                    "entPersonOpenCode": "entPersonOpenCode",
                    "type": "type",
                    "personSearch": "personSearch",
                    "companySearch": "companySearch",
                    "InitiatorCompanyCode": "InitiatorCompanyCode",
                    "companyName": "companyName",
                    "InitiatorCompanyName": "InitiatorCompanyName",
                    "companyUserName": "companyUserName",
                    "InitiatorSearch": "InitiatorSearch"
                }
            }
        }
    },
    "jwt": {
        "name": "letsign",
        "password": "kintone",
        "secret": "letsignkintonedld",
        "expiresIn": 60 * 60 * 24 * 365 * 30,
        "token": "xxxxxx"
    },
    "letsign": {
        "baseUrl": "https://sandbox.letsign.com",
        "appCode": "xxx",
        "appSecret": "xxxx",
        "secret": "xxxx",
        "companyOpenCode": "test_for_caiwangzi",
        "companySignatureCode": "xxx",
        "personCertNotifyUrl": "https://cybozudev.haoricheng.cn/node/callback/updatePersonCertResult",
        "entCertNotifyUrl": "https://cybozudev.haoricheng.cn/node/callback/updateEntCertResult",
        "apiList": {
            "getCertUrl": "/open-api/certification/getCertUrl",
            "person3": "/open-api/certification/noUser/person3/",
            "generateCorporate": "/open-api/certification/generateCorporate",
            "generateAgent": "/open-api/certification/generateAgent",
            "generateIndividualBiz": "/open-api/certification/generateIndividualBiz",
            "uploadAudit": "/open-api/certification/uploadAudit",
            "payCheckVerify": "/open-api/certification/payCheckVerify",
            "upload": "/open-api/contract/opt/upload",
            "uploadTemplate": "/open-api/contract/opt/uploadTemplate",
            "generate": "/open-api/contract/opt/generate",
            "applyForSign": "/open-api/contract/sign/applyForSign",
            "autoSign": "/open-api/contract/sign/autoSign",
            "archive": "/open-api/contract/opt/archive",
            "inactive": "/open-api/contract/opt/inactive",
            "getShortUrl": "/open-api/contract/sign/getShortUrl",
            "updateSignUrlExpireTime": "/open-api/contract/sign/updateSignUrlExpireTime",
            "signStatus": "/open-api/contract/sign/signStatus",
            "getEntCertUrl": "/open-api/certification/getEntCertUrl",
            "queryEntCertProgress": "/open-api/certification/queryEntCertProgress"
        }
    },
    "mail": {
        "host": "smtpdm.aliyun.com",
        "port": 465,
        "from": "developer@haoricheng.cn",
        "aliasName": "kintone&电子牵",
        "password": "xxxx"
    },
    "yjsms": {
        "url": "http://118.178.116.15/winnerrxd/api/trigger/SendMsg",
        "userCode": "xxx",
        "userPass": "xxx",
    }
}