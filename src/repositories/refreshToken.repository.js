const RefreshToken=require('../models/refreshToken.model');
const { Op }=require('sequelize');

class RefreshTokenRepository{
    async create({token,userId,expiresAt,userAgent}){
        return RefreshToken.create({token,userId,expiresAt,userAgent})
    }
    async findByToken(toke){
        return RefreshToken.findOne({
            where:{
                token,
                revokedAt:null,
                expiresAt:{ [Op.gt]: new Date() } //gt greater 
            }
        })
    }
    async revokeToken(token){
        return RefreshToken.update(
            { revokedAt:new Date()},
            { where:{ token } }
        )
    }
    async revokeAllForUser(userId){
        return RefreshToken.update(
            { revokedAt: new Date()},
            { where :{ userId },revokedAt:null }
        )
    }
}
module.exports=new RefreshTokenRepository()