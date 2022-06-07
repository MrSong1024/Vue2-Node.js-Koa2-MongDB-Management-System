/*
 * @Author: Songjq
 * @Date: 2021-12-05 22:20:10
 * @Desscription: 设置和获取token
 */
import Cookies from "js-cookie";
import Config from "@/settings";

const TokenKey = Config.TokenKey;

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
  // if (rememberMe) {
  //   return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  // } else return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
