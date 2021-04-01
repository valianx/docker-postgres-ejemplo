const { default: axios } = require("axios");
const express = require("express");
const moment = require("moment");
const app = express();

const { Pool } = require("pg");
const pgp = require("pg-promise")();

const db = pgp({
  host: "db",
  user: "admin",
  password: "1234",
  database: "db",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8888;

const client = new Pool({
  host: "db",
  user: "admin",
  password: "1234",
  database: "db",
});

client.connect();

app.post("/GetInternetBetsReportPaging", async (req, res) => {
  try {
    const createTableText = `
              CREATE TEMP TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              ClientId VARCHAR(50), 
              BetAmount INT,
              BetDateFrom DATE,
              BetDateBefore DATE, 
              );
            `;
    let status;

    try {
      let BetDateBefore = moment();

      let BetDateBeforeMinutes = BetDateBefore.minutes();
      let BetDateBeforeSeconds = BetDateBefore.seconds();
      let BetDateBeforeMiliseconds = BetDateBefore.milliseconds();

      BetDateBefore = BetDateBefore.subtract(BetDateBeforeMinutes, "minutes");
      BetDateBefore = BetDateBefore.subtract(BetDateBeforeSeconds, "seconds");
      BetDateBefore = BetDateBefore.subtract(
        BetDateBeforeMiliseconds,
        "milliseconds"
      );

      console.log("BetDateBefore", BetDateBefore);
      let BetDateFrom = moment(BetDateBefore).subtract(1, "hour");
      console.log("BetDateFrom", BetDateFrom);

      let bodyRequest_1 = {
        Controller: "Report",
        Method: "GetInternetBetsReportPaging",
        ApiKey: "18a2713da0c594bb4c232d40bae01bb786f50a31",
        UserId: 387,
        RequestObject: {
          SkipCount: 0,
          TakeCount: 100,
          OrderBy: 1,
          FieldNameToOrderBy: "BetDocumentId",
          BetDateFrom,
          BetDateBefore,
        },
      };
      let response_1 = await axios.post(
        "https://adminwebapi.iqsoftllc.com/api/Main/ApiRequest?TimeZone=4&LanguageId=en",
        bodyRequest_1
      );

      try {
        let currentCountRequest = response_1.data.ResponseObject.Bets.Count;
        let bodyRequest_2 = {
          Controller: "Report",
          Method: "GetInternetBetsReportPaging",
          ApiKey: "18a2713da0c594bb4c232d40bae01bb786f50a31",
          UserId: 387,
          RequestObject: {
            SkipCount: 0,
            TakeCount: currentCountRequest,
            OrderBy: 1,
            FieldNameToOrderBy: "BetDocumentId",
            BetDateFrom,
            BetDateBefore,
          },
        };
        let response_2 = await axios.post(
          "https://adminwebapi.iqsoftllc.com/api/Main/ApiRequest?TimeZone=4&LanguageId=en",
          bodyRequest_2
        );

        let allNecessaryData = [];
        let necessaryDataWithBonus = [];
        let necessaryDataWithoutBonus = [];
        response_2.data.ResponseObject.Bets.Entities.map((data) =>
          allNecessaryData.push({
            ClientId: data.ClientId,
            BetAmount: data.BetAmount / 0.001371177841766,
            BetDateFrom,
            BetDateBefore,
          })
        );

        response_2.data.ResponseObject.Bets.Entities.filter(
          (dataWithoutBonus) => dataWithoutBonus.BonusId !== null
        ).map((data) =>
          necessaryDataWithBonus.push({
            ClientId: data.ClientId,
            BetAmount: data.BetAmount / 0.001371177841766,
            BetDateFrom,
            BetDateBefore,
          })
        );

        response_2.data.ResponseObject.Bets.Entities.filter(
          (dataWithoutBonus) => dataWithoutBonus.BonusId === null
        ).map((data) =>
          necessaryDataWithoutBonus.push({
            ClientId: data.ClientId,
            BetAmount: data.BetAmount / 0.001371177841766,
            BetDateFrom,
            BetDateBefore,
          })
        );

        let groupByAllNecessaryData = function (array, prop) {
          return array.reduce(function (groups, item) {
            let val = item[prop];
            groups[val] = groups[val] || {
              ClientId: item.ClientId,
              BetAmount: 0,
              BetDateFrom,
              BetDateBefore,
            };
            groups[val].BetAmount += item.BetAmount;
            return groups;
          }, {});
        };

        let preResultAllNecessaryData = Object.values(
          groupByAllNecessaryData(allNecessaryData, "ClientId")
        );
        let resultAllNecessaryData = preResultAllNecessaryData.sort(
          (a, b) => b.BetAmount - a.BetAmount
        );

        let groupByNecessaryDataWithBonus = function (array, prop) {
          return array.reduce(function (groups, item) {
            let val = item[prop];
            groups[val] = groups[val] || {
              ClientId: item.ClientId,
              BetAmount: 0,
              BetDateFrom,
              BetDateBefore,
            };
            groups[val].BetAmount += item.BetAmount;
            return groups;
          }, {});
        };

        let preResultNecessaryDataWithBonus = Object.values(
          groupByNecessaryDataWithBonus(necessaryDataWithBonus, "ClientId")
        );
        let resultNecessaryDataWihBonus = preResultNecessaryDataWithBonus.sort(
          (a, b) => b.BetAmount - a.BetAmount
        );

        let groupByNecessaryDataWithoutBonus = function (array, prop) {
          return array.reduce(function (groups, item) {
            let val = item[prop];
            groups[val] = groups[val] || {
              ClientId: item.ClientId,
              BetAmount: 0,
              BetDateFrom,
              BetDateBefore,
            };
            groups[val].BetAmount += item.BetAmount;
            return groups;
          }, {});
        };

        let preResultNecessaryDataWithoutBonus = Object.values(
          groupByNecessaryDataWithoutBonus(
            necessaryDataWithoutBonus,
            "ClientId"
          )
        );
        let resultNecessaryDataWihoutBonus = preResultNecessaryDataWithoutBonus.sort(
          (a, b) => b.BetAmount - a.BetAmount
        );

        status = response_2.status;

        await client.query(createTableText);

        const finalData = {
          allData: resultAllNecessaryData,
          dataWihBonus: resultNecessaryDataWihBonus,
          dataWihoutBonus: resultNecessaryDataWihoutBonus,
        };

        // await Promise.all(
        //   finalData.allData.map((data) => {
        //     client.query(
        //       `INSERT INTO users(id, ClientId, BetAmount, BetDateFrom, BetDateBefore)
        //        VALUES($1, ${data.ClientId}, ${data.BetAmountd}, ${data.BetDateFrom}, ${data.BetDateBefore})`
        //     );
        //   })
        // );

        db.tx((t) => {
          var queries = finalData.allData.map((u) => {
            return t.none(
              `INSERT INTO Users(id, ClientId, BetAmount, BetDateFrom, BetDateBefore) VALUES($1, ${data.ClientId}, ${data.BetAmountd}, ${data.BetDateFrom}, ${data.BetDateBefore})`,
              u
            );
          });
          return t.batch(queries);
        })
          .then((data) => {
            console.log("AAAAA", data);
          })
          .catch((error) => {
            console.log("EERORRRR", error);
          });

        res.status(status).json({
          allData: resultAllNecessaryData,
          dataWihBonus: resultNecessaryDataWihBonus,
          dataWihoutBonus: resultNecessaryDataWihoutBonus,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      // res.status(error.response.status).json(error.response.data);
    }
    // await datos();
    // console.log(await selectData());
  } catch (error) {
    console.log(error);
  }
  // client.end()
});

app.get("/getDataTournamentLasVegas", async (req, res) => {
  try {
    const { rows } = await client.query(
      "SELECT SUM(finalData.BetAmount) AS TOTAL, ClientId FROM users GROUP BY ClientId ORDER BY TOTAL, ClientId DESC LIMIT 50"
    );
    console.log(rows);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
});
app.get("/getAllDataTournamentLasVegas", async (req, res) => {
  try {
    const { rows } = await client.query("SELECT * from users");
    console.log(rows);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
});

app.listen(PORT, () => {
  console.log("Server on port ", PORT);
});
