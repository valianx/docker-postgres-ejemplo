"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Sequelize = require("sequelize");

var sequelize = require("./DB");

var Model = Sequelize.Model;

var Data =
/*#__PURE__*/
function (_Model) {
  _inherits(Data, _Model);

  function Data() {
    _classCallCheck(this, Data);

    return _possibleConstructorReturn(this, _getPrototypeOf(Data).apply(this, arguments));
  }

  return Data;
}(Model);

Data.init({
  // attributes
  ClientId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  BonusId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  BetAmount: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  BetDateFrom: {
    type: Sequelize.DATE,
    allowNull: true
  },
  BetDateBefore: {
    type: Sequelize.DATE,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  sequelize: sequelize,
  modelName: "Datos" // options

}); // Data.sync({ alter: true }).then(() => { });
// Data.sync({
//     force: true
// }).then(() => {});

module.exports = Data;