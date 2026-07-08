const User = require('../models/user.model')

class UserRepository {
    async findByEmail(email) {
        return User.findOne({
            where: {
                email
            }
        })
    }
    async findById(id){
        return User.findByPk(id)
    }
    async create({ fullName,email,passwordHash,role}){
        return User.create({ fullName,email,passwordHash,role })
       
    }
}
module.exports = new UserRepository()