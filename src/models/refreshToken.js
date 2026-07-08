const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user.model');

class RefreshToken extends Model {}
RefreshToken.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    token:{
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    expiresAt:{
        type: DataTypes.DATE,
        allowNull:false
    },
    revokedAt:{
        type: DataTypes.DATE,
        allowNull:true
    },
    userAgent:{
        type: DataTypes.STRING(255),
        allowNull:true
    }
},{
    sequelize,
    modelName: 'RefreshToken',
    tableName:'refresh_tokens',
    timestamps: true, //createdAt, updatedAt
})
RefreshToken.belongsTo(User,{ foreignKey: 'userid',onDelete: 'CASCADE' });
User.hasMany(RefreshToken,{ foreignKey:'userId'})

module.exports = RefreshToken;