// const sequelize = require('../../config/database')
const sequelize = require('../../config/database')
const {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt');

const User = sequelize.define('User',
    {
        name :{
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            validate : {
                isEmail : true
            }
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        role : {
            type : DataTypes.STRING,
            allowNull : false,
            defaultValue : 'user',
            validate : {
                isIn :[['user', 'admin']]
            }
        },
        resetToken:{
            type:DataTypes.STRING,
            allowNull:true
        },
        resetTokenExpires:{
            type:DataTypes.DATE,
            allowNull:true
        },
        isVerified :{
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        verificationToken : {
            type : DataTypes.STRING,
            allowNull : true
        }
    }
);

User.beforeCreate(async (user)=>{
    user.password = await bcrypt.hash(user.password, 10)
})

// User.associate = (models) => {
// User.hasMany(models.Order, {foreignKey: 'userId', as: 'orders'})
// }

module.exports = User