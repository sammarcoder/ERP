// const sequelize = require('../../config/database')
// const { DataTypes } = require('sequelize')

// const ZsalesMan = sequelize.define('ZsalesMan', {
//     name: {
//         type: DataTypes.STRING(45),
//         allowNull: false,
//         validate: {
//             notEmpty: true
//         },
//     },
//     city: {
//         type: DataTypes.STRING(45),
//         allowNull: false,
//         validate: {
//             notEmpty: true
//         }
//     },

//     adress: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//     },
//     telephone: {
//         type: DataTypes.STRING(15),
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//             is: /^[0-9]+$/ // Ensures only numbers are allowed
//         }
//     }
// })

// module.exports = { ZsalesMan }






























const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZsalesMan = sequelize.define('ZsalesMan', {
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    city: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    adress: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[0-9]+$/ // Ensures only numbers are allowed
        }
    }
});

module.exports = ZsalesMan;
