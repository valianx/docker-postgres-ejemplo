"use strict";

var Sequelize = require("sequelize");

try {
  var sequelize = new Sequelize("db", //db
  "admin", //user
  "1234", //password
  {
    host: "db",
    port: 5432,
    dialect: "postgres"
    /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    ,
    //en caso de error de ssl, descomentar abajo
    // dialectOptions: {
    //     ssl: {
    //         rejectUnauthorized: false,
    //     },
    // },
    logging: console.log
  }); // const sequelize = new Sequelize('mysql://bea408fafdbe8f:d521c44f@us-cdbr-east-02.cleardb.com/heroku_ce6f0f29b65de64?reconnect=true');

  sequelize.authenticate().then(function () {
    console.log("Connection has been established successfully.");
  })["catch"](function (err) {
    console.error("Unable to connect to the database:", err);
  });
  module.exports = sequelize;
} catch (error) {
  console.log(error);
}