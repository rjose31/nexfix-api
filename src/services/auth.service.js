const userRepository = require('../repositories/user.repository')
const RefreshTokenRepository = require('../repositories/refreshToken.repository')

const {
    hashPassword,
    comparePassword
} = require('../utils/password')
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../utils/jwt')

class AuthService {
    async register({
        fullName,
        email,
        password,
        role
    }) {
        const existingUser = await userRepository.findByEmail(email)
        if (existingUser) {
            const error = new Error('El correo electrónico ya está registrado')
            error.statusCode = 409
            throw error
        }
        const passwordHash = await hashPassword(password)
        const user = await userRepository.create({
            fullName,
            email,
            passwordHash,
            role
        })
        return this._issueTokens(user)
    }

    async login({
        email,
        password,
        userAgent
    }) {
        const user = await userRepository.findByEmail(email)
        const invalidCredentialsError = () => {
            const error = new Error('Credenciales inválidas')
            error.statusCode = 401
            throw error
        }
        if (!user) throw invalidCredentialsError()

        const isPasswordValid = await comparePassword(password, user.passwordHash)
        if (!isPasswordValid) throw invalidCredentialsError()

        return this._issueTokens(user, userAgent)
    }
    async refresh(oldRefreshToken) {
        let payload
        try {
            payload = verifyRefreshToken(oldRefreshToken)
        } catch (err) {
            const error = new Error('Refresh token inválido o expirado')
            error.statusCode = 401
            throw error
        }
        const storedToken = await refreshTokenRepository.findByToken(oldRefreshToken)
        if (!storedToken) {
            const error = new Error('Refresh token inválido o expirado')
            error.statusCode = 401
            throw error
        }
        const user = await userRepository.findById(payload.sub)

        await refreshTokenRepository.revokeToken(oldRefreshToken)

        return this._issueTokens(user)
    }

    async logout(refreshToken) {
        await refreshTokenRepository.revokeToken(refreshToken)
    }
    async _issueTokens(user, userAgent) {
        const accessToken = generateAccessToken(user)
        const {
            token: refreshtoken,
            expiresAt
        } = generateRefreshToken(user)
        await refreshTokenRepository.create({
            token:refreshtoken,
            userId:user.id,
            expiresAt,
            userAgent   
        })
        return {
            accessToken,
            refreshToken: refreshtoken,
            user:{
                id:user.id,
                fullName:user.fullName,
                email:user.email,
                role:user.role
            }
        }
    }
}
module.exports = new AuthService()