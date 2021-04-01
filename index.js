const {
    default: axios
} = require("axios");
const express = require("express");
const moment = require("moment");
const app = express();

const Data = require('./Data');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const PORT = process.env.PORT || 8888;

app.post("/GetInternetBetsReportPaging", async (req, res) => {
    try {
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

                // console.log(response_2.data.ResponseObject.Bets.Entities);

                let allNecessaryData = [];
                response_2.data.ResponseObject.Bets.Entities.map((data) =>
                    allNecessaryData.push({
                        ClientId: data.ClientId,
                        BetAmount: data.BetAmount / 0.001371177841766,
                        BonusId: data.BonusId,
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
                            BonusId: item.BonusId,
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

                status = response_2.status;
                let i = 0
                resultAllNecessaryData.map(async data => {
                    const datos = Data.build({
                        ClientId: data.ClientId,
                        BonusId: data.BonusId,
                        BetAmount: data.BetAmount,
                        BetDateFrom: data.BetDateFrom,
                        BetDateBefore: data.BetDateBefore
                    })
                    console.log(i)
                    i++
                    await datos.save()
                })
                console.log(resultAllNecessaryData);
                return res.status(status).json({
                    data: resultAllNecessaryData,
                });
                // Promise.all(map, () => {
                // })
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
        const datos = await Data.findAll()
        return res.status(200).json(datos);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
});

app.listen(PORT, () => {
    console.log("Server on port ", PORT);
});