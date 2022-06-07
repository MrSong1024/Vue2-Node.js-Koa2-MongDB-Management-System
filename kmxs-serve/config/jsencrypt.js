/*
 * @Author: Songjq
 * @Date: 2021-12-07 15:49:55
 * @Desscription:
 */
// node-rsa 密码解密
const NodeRSA = require("node-rsa");
const _priKey = `-----BEGIN RSA PRIVATE KEY-----
    MIICXQIBAAKBgQCK3siV2MKl7ADFMajEsbc/ZrSTfo9h37c6+m0cUHOTqGR4V+Ug
    zc5Wzpcrz6QGu7/umQBJRC3LZ8xRW8+J6Z1lI0+Tr6LT8NfLUeyBTBXkBI1j0BIz
    mEjsW/a1vDr2ahXn1RFvtnHeKs41lbICkY7mRA2cAyiMWhrteM1d1MR3gQIDAQAB
    AoGACUU8ELzKqbbqij95a8ANYp8hmOMPAVKk8bv8ArLgNFA+fMYpVppGlwbtkpAm
    /AgWlQADw+BYSkbgneHKJgPBbQB+G8/AmMY/u3KIFS4wJifaIAv2evDlFqtw2zI6
    bG7bg65YF9AS1l9B+O3IdqMDNBKqQYiItx1A/SfogAXJctECQQDeIzh3k8mkzyMe
    lxrFY5kJ5u+ydse82nOmawxo3kS/WEZh2jadeUdAXvXDhXrQ4O1t8zrG4gY6sAq4
    3KqeouBdAkEAoAobkEY/M/Rtya8tomm3Dg9+Hc9yNphVr8fG3tLpphALuGSP+0Qp
    9ONyoC4G71MnIPtqBl6JDNzKARY2NUjRdQJBANw/57kIW6KBjrzB7dVRD2h2BavZ
    gemKX6jd8wv3dgqSqBZVmllA6pi0jtEyA7gfjMq7o8eWS77c1YS9pp5ruDECQQCJ
    Ep8xHzmbAkvWZpgrd2g2PsbCOZ+VazxY5j9LMlK0zSF8uYUorOVSvky7LTD7Yrks
    4qmY8vdncOQDskaTtN7RAkBc/3Brhc5eG0/XHqKrATY+H0GD/muzpLSLuDXVjgqh
    lEYH3FAsW+VP5dQ6AuzW+wkFDbztdvr5MF9Mluyxc3Fe
    -----END RSA PRIVATE KEY-----`;
// node-rsa end
const jsencrypt = {
    // 解密
    decrypt(password) {
        const privateKey = new NodeRSA(_priKey);
        privateKey.setOptions({ encryptionScheme: "pkcs1" }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
        var res = privateKey.decrypt(password, "utf8");
        return res;
    },
};

module.exports = jsencrypt;