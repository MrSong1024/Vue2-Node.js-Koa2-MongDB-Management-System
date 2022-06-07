/*
 * @Author: Songjq
 * @Date: 2022-01-23 21:18:14
 * @Desscription: 
 */
const bcrypt = require('bcryptjs');
const tools = {
    enbcrypt(password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    }
};
module.exports = tools;