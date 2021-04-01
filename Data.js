const Sequelize = require("sequelize");
const sequelize = require("./DB");

const Model = Sequelize.Model;

class Data extends Model {}
Data.init({
    // attributes
    ClientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    BonusId: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    BetAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    BetDateFrom: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    BetDateBefore: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    sequelize,
    modelName: "Datos",
    // options
});

// Data.sync({ alter: true }).then(() => { });
// Data.sync({
//     force: true
// }).then(() => {});

module.exports = Data;