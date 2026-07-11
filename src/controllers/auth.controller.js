const authService = require('../services/auth.service')

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth'
}

class AuthController {
    async register(req, res, next) {
        try {
            const {
                fullName,
                email,
                password,
                role
            } = req.body
            const {
                accessToken,
                refreshToken,
                user
            } = await authService.register({
                fullName,
                email,
                password,
                role
            })
            res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)
            res.status(201).json({
                accessToken,
                user
            })
        } catch (error) {
            next(error)
        }

    }
    async login(req, res, next) {
        try {
            const {
                email,
                password
            } = req.body
            const { accessToken,refreshToken,user}= await authService.login({
                email,
                password,
                userAgent:req.headers['user-agent']
            })
            res.cookie('refreshToken',refreshToken,REFRESH_COOKIE_OPTIONS)
        } catch (error) {
            next(error)
        }
    }
    async refresh(req,res,next){
        try {
            const oldRefreshToken=req.cookies?.refreshToken
            if(!oldRefreshToken){
                return res.status(401).json({ message:'No hay sesión activa'})
            }
            const {accessToken,refreshToken,user }=authService.refresh(oldRefreshToken)
            res.cookie('refreshToken',refreshToken,REFRESH_COOKIE_OPTIONS)
            res.status(200).json({ accessToken,user })
        } catch (error) {
            next(error)
        }
    }
    async logout(req,res,next){
        try {
             const refreshToken=req.cookies?.refreshToken
             if(refreshToken){
                await authService.logout(refreshToken)
             }
             res.clearCookie('refreshToken',REFRESH_COOKIE_OPTIONS)
             res.status.send()
        } catch (error) {
            next(error)
        }
    }
}
module.exports=new AuthController()