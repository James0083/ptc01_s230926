import { Request, Response } from 'express';
import { jsonToXml } from './ptc01_parsingData';
const candleService = require("../services/ptc01_db.ts");

const getAllCandles = (req: Request, res: Response) => {
    const {
        params: { res_mode },
    } = req;
    candleService.getAllData().then((allCandles: any) => {
        // res.send("Get all workouts");
        if (res_mode === "json") {
            res.send({ status: "OK", data: allCandles });
        } else {
            res.send({ status: "OK", data: jsonToXml(allCandles, 'Candles') });
        }
    }).catch((error: any) => {
        res.status(500)
            .send({ status: "FAILED", data: { error: error } });
    })
};

const getRangeCandle = (req: Request, res: Response) => {
    const {
        params: { res_mode, start_time, end_time },
    } = req;
    if (!start_time || !end_time){
        res.status(400)
            .send({
                status: "FAILED",
                data: { error: "Parameter ':start_time' or ':end_time' can not be empty" },
            });
    }

    candleService.getRangeData(start_time, end_time).then((rangeCandle: any) => {
        // res.send("Get an existing workout");
        // console.log("-----rangeCandle-----\n"+rangeCandle)
        if (res_mode === "json") {
            res.send({ status: "OK", data: rangeCandle });
        } else {
            res.send({ status: "OK", data: jsonToXml(rangeCandle, 'Candles') });
        }
    }).catch ((error: any) => {
        res.status(500)
            .send({ status: "FAILED", data: { error: error } });
    })
};


module.exports = {
    getAllCandles,
    getRangeCandle,
};