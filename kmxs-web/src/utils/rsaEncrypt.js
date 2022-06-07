/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:10
 * @Desscription: 信息加密
 */
import JSEncrypt from "jsencrypt/bin/jsencrypt";
// 密钥对生成 http://web.chacuo.net/netrsakeypair
// const publicKey =
//   "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n" +
//   "2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ==";
// const privateKey =
//   "MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n" +
//   "mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n" +
//   "B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n" +
//   "/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n" +
//   "UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n" +
//   "vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n" +
//   "4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n" +
//   "tTbklZkD2A==";

const _pubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCK3siV2MKl7ADFMajEsbc/ZrST
fo9h37c6+m0cUHOTqGR4V+Ugzc5Wzpcrz6QGu7/umQBJRC3LZ8xRW8+J6Z1lI0+T
r6LT8NfLUeyBTBXkBI1j0BIzmEjsW/a1vDr2ahXn1RFvtnHeKs41lbICkY7mRA2c
AyiMWhrteM1d1MR3gQIDAQAB
-----END PUBLIC KEY-----`;

export function encrypt(txt) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(_pubKey);
  // 加密数据
  var res = encrypt.encrypt(txt);
  return res; // 对需要加密的数据进行加密
}

// 加密
// export function encrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPublicKey(publicKey) // 设置公钥
//   return encryptor.encrypt(txt) // 对需要加密的数据进行加密
// }

// 解密
// export function decrypt(txt) {
//   const encryptor = new JSEncrypt();
//   encryptor.setPrivateKey(privateKey);
//   return encryptor.decrypt(txt);
// }
