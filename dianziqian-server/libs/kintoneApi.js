const { KintoneRestAPIClient } = require("@kintone/rest-api-client");
const { config } = require('../config.js');

class kintoneApi {
    constructor(apiToken) {
        this.client = new KintoneRestAPIClient({
            baseUrl: config.kintone.domain,
            auth: { apiToken: apiToken }
        });
    }

    getRecord(param) {
        return this.client.record.getRecord(param);
        // return record;
    }

    updateRecord(param) {
        return this.client.record.updateRecord(param);
    }


    getFile(fileKey) {
        const buffer = this.client.file.downloadFile({
            fileKey: fileKey
        });
        return buffer;
    };
}
module.exports = kintoneApi