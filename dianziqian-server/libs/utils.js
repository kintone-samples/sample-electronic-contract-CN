const { Readable } = require("stream")
const crypto = require("crypto")
const { config } = require("../config");

class utils {
    static checkLetsignSecret(req, res, next) {
        if (config.letsign.secret != req.headers.secret) {
            res.status(401).send('invalid token...');
        }
        else {
            next();
        }
    }

    static bufferToStream(binary) {
        return new Readable({
            read() {
                this.push(binary);
                this.push(null);
            }
        });
    }

    static ksort(o) {
        let sorted = {},
            keys = Object.keys(o);
        keys.sort();
        keys.forEach((key) => {
            sorted[key] = o[key];
        })
        return sorted;
    }

    static encode(type, content) {
        let data = '';
        switch (type) {
            case "md5":
                data = crypto.createHash('md5').update(content).digest("hex");
                break;
            case "sha1":
                data = crypto.createHash('sha1').update(content).digest("hex");
                break;
            default:
                data = content;
        }
        return data;
    }

    static toUrlParams(data, path) {
        let buff = "";
        for (let key in data) {
            let value = data[key];
            if (key !== "sign" && value !== "") {
                buff += `${key}=${value}`;
            }
        }
        buff += path;
        return utils.encode("md5", buff);
    }

    static formatTokintoneLink(url, text) {
        return `<div><a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${text}</a><br /></div>`;
    }
}

module.exports = utils