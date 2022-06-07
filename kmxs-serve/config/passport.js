/*
 * @Author: Songjq
 * @Date: 2021-12-04 13:58:47
 * @Desscription:
 */
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Online = require("../models/system/Online");

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            // 1.获取当前用户的用户信息；
            const user = await User.findById(jwt_payload.id);

            // 2.验证tokenId是否存在，如果存在则token有效，否则无效
            const findOnline = await Online.findOne({ tokenId: jwt_payload.tokenId })

            // 3.更新jwt token过期时间
            await Online.updateOne({ tokenId: jwt_payload.tokenId }, {
                $set: {
                    exp: jwt_payload.exp
                }
            })

            if (findOnline) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    );
};