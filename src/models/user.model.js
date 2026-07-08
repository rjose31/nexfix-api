const {
    DataTypes,
    Model
} = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('client', 'admin', 'provider'),
        allowNull: false,
        defaultValue: 'client'
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    modelName: 'User',
    tableName:'users',
    timestamps: true, //createdAt
})