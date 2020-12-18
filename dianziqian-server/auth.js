const jsonwebtoken = require('jsonwebtoken');
const { config } = require('./config');

class auth {
    auth(req, res) {

        let user = {
            name: config.jwt.name,
            password: config.jwt.password,
        }
        const payload = {
            name: user.name,
            role: user.role
        }

        // 创建token
        var token = jsonwebtoken.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

        // json格式返回token
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });

    }
}
module.exports = auth;

