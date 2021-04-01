"use strict";

var _require = require("axios"),
    axios = _require["default"];

var express = require("express");

var moment = require("moment");

var app = express();

var Data = require('./Data');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
var PORT = process.env.PORT || 8888;
app.post("/GetInternetBetsReportPaging", function _callee2(req, res) {
  var status, BetDateBefore, BetDateBeforeMinutes, BetDateBeforeSeconds, BetDateBeforeMiliseconds, BetDateFrom, bodyRequest_1, response_1, currentCountRequest, bodyRequest_2, response_2, allNecessaryData, groupByAllNecessaryData, preResultAllNecessaryData, resultAllNecessaryData, i;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.prev = 1;
          BetDateBefore = moment();
          BetDateBeforeMinutes = BetDateBefore.minutes();
          BetDateBeforeSeconds = BetDateBefore.seconds();
          BetDateBeforeMiliseconds = BetDateBefore.milliseconds();
          BetDateBefore = BetDateBefore.subtract(BetDateBeforeMinutes, "minutes");
          BetDateBefore = BetDateBefore.subtract(BetDateBeforeSeconds, "seconds");
          BetDateBefore = BetDateBefore.subtract(BetDateBeforeMiliseconds, "milliseconds");
          console.log("BetDateBefore", BetDateBefore);
          BetDateFrom = moment(BetDateBefore).subtract(1, "hour");
          console.log("BetDateFrom", BetDateFrom);
          bodyRequest_1 = {
            Controller: "Report",
            Method: "GetInternetBetsReportPaging",
            ApiKey: "18a2713da0c594bb4c232d40bae01bb786f50a31",
            UserId: 387,
            RequestObject: {
              SkipCount: 0,
              TakeCount: 100,
              OrderBy: 1,
              FieldNameToOrderBy: "BetDocumentId",
              BetDateFrom: BetDateFrom,
              BetDateBefore: BetDateBefore
            }
          };
          _context2.next = 15;
          return regeneratorRuntime.awrap(axios.post("https://adminwebapi.iqsoftllc.com/api/Main/ApiRequest?TimeZone=4&LanguageId=en", bodyRequest_1));

        case 15:
          response_1 = _context2.sent;
          _context2.prev = 16;
          currentCountRequest = response_1.data.ResponseObject.Bets.Count;
          bodyRequest_2 = {
            Controller: "Report",
            Method: "GetInternetBetsReportPaging",
            ApiKey: "18a2713da0c594bb4c232d40bae01bb786f50a31",
            UserId: 387,
            RequestObject: {
              SkipCount: 0,
              TakeCount: currentCountRequest,
              OrderBy: 1,
              FieldNameToOrderBy: "BetDocumentId",
              BetDateFrom: BetDateFrom,
              BetDateBefore: BetDateBefore
            }
          };
          _context2.next = 21;
          return regeneratorRuntime.awrap(axios.post("https://adminwebapi.iqsoftllc.com/api/Main/ApiRequest?TimeZone=4&LanguageId=en", bodyRequest_2));

        case 21:
          response_2 = _context2.sent;
          // console.log(response_2.data.ResponseObject.Bets.Entities);
          allNecessaryData = [];
          response_2.data.ResponseObject.Bets.Entities.map(function (data) {
            return allNecessaryData.push({
              ClientId: data.ClientId,
              BetAmount: data.BetAmount / 0.001371177841766,
              BonusId: data.BonusId,
              BetDateFrom: BetDateFrom,
              BetDateBefore: BetDateBefore
            });
          });

          groupByAllNecessaryData = function groupByAllNecessaryData(array, prop) {
            return array.reduce(function (groups, item) {
              var val = item[prop];
              groups[val] = groups[val] || {
                ClientId: item.ClientId,
                BetAmount: 0,
                BonusId: item.BonusId,
                BetDateFrom: BetDateFrom,
                BetDateBefore: BetDateBefore
              };
              groups[val].BetAmount += item.BetAmount;
              return groups;
            }, {});
          };

          preResultAllNecessaryData = Object.values(groupByAllNecessaryData(allNecessaryData, "ClientId"));
          resultAllNecessaryData = preResultAllNecessaryData.sort(function (a, b) {
            return b.BetAmount - a.BetAmount;
          });
          status = response_2.status;
          i = 0;
          resultAllNecessaryData.map(function _callee(data) {
            var datos;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    datos = Data.build({
                      ClientId: data.ClientId,
                      BonusId: data.BonusId,
                      BetAmount: data.BetAmount,
                      BetDateFrom: data.BetDateFrom,
                      BetDateBefore: data.BetDateBefore
                    });
                    console.log(i);
                    i++;
                    _context.next = 5;
                    return regeneratorRuntime.awrap(datos.save());

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          console.log(resultAllNecessaryData);
          return _context2.abrupt("return", res.status(status).json({
            data: resultAllNecessaryData
          }));

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](16);
          console.log(_context2.t0);

        case 37:
          _context2.next = 42;
          break;

        case 39:
          _context2.prev = 39;
          _context2.t1 = _context2["catch"](1);
          console.log(_context2.t1); // res.status(error.response.status).json(error.response.data);

        case 42:
          _context2.next = 47;
          break;

        case 44:
          _context2.prev = 44;
          _context2.t2 = _context2["catch"](0);
          console.log(_context2.t2);

        case 47:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 44], [1, 39], [16, 34]]);
});
app.get("/getDataTournamentLasVegas", function _callee3(req, res) {
  var datos;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Data.findAll());

        case 3:
          datos = _context3.sent;
          return _context3.abrupt("return", res.status(200).json(datos));

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(500).json(_context3.t0.message));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.listen(PORT, function () {
  console.log("Server on port ", PORT);
});