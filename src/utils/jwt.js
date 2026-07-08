const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRES_IN = '15m'
const REFRESH_TOKEN_EXPIRES_IN_DAYS = '7'

const generateAccessToken = (user) => {
    return jwt.sign({
            sub: user.id,
            role: user.role
        },
        ACCESS_TOKEN_SECRET, {
            expiresIn: `${ACCESS_TOKEN_EXPIRES_IN}d`
        }
    )
}

const generateRefreshToken = (user) => {
      return jwt.sign({
            sub: user.id
        },
        REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN_DAYS
        })
       const expiresAt = new Date();
       expiresAt.setDate(expiresAt.getDate() + parseInt(REFRESH_TOKEN_EXPIRES_IN_DAYS));
       return {
        token: refreshToken,
        expiresAt: expiresAt
    }
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET)
}

module.exports={
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}