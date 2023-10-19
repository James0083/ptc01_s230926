// import { candleSchema } from "./ptc01_schema";
// import { candle_data } from "./ptc01_schema";

import { consoleLogger, errorLogger } from "./ptc01_logger";

// var mongoose = require('mongoose');
import mongoose, {Schema, Document} from "mongoose";
import { connectionString, LogDBconnectionString } from "./DBconfig";

var dbConnectFlag: boolean = false;

// const existingCandleModel = mongoose.models['Candle'];
// if (existingCandleModel) {
//   existingCandleModel.deleteOne();
// }
// const existingCandleLogModel = mongoose.models['CandleLog'];
// if (existingCandleLogModel) {
//   existingCandleLogModel.deleteOne();
// }

async function connectDB(connectionString: string) {
    await mongoose.connect(connectionString);

    var db = mongoose.connection;
    // 연결 실패
    db.on('error', function () {
        consoleLogger.log('Connection Failed!');
        process.exit(1);
    });
    // 연결 성공
    db.once('open', function () {
        dbConnectFlag = true;
        consoleLogger.log('Connected MongoDB!');
    });

}

export interface candle_data extends Document{
  market_id: string;
  open: number;
  close: number;
  low: number;
  high: number;
  base_volume: number;
  quote_volume: number;
  start_time: Date;
  end_time: Date;
}

const candleSchema: Schema = new Schema({
    market_id: { type: String, required: true },
    open: { type: Number, required: true },
    close: { type: Number, required: true },
    low: { type: Number, required: true },
    high: { type: Number, required: true },
    base_volume: { type: Number, required: true },
    quote_volume: { type: Number, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true }
});

// candleSchema.index({ market_id: 1, start_time: 1, end_time: 1 }, { unique: true });

var candle_model = mongoose.model<candle_data>('Candle', candleSchema);

interface log_data extends Document{
    log_time: string;
    logMessage: string;
};

const LogSchema = new Schema({
    log_time: { type: String, required: true },
    logMessage: { type: String, required: true}
});

var log_message = mongoose.model<log_data>('CandleLog', LogSchema);

async function saveDataToCandleCollection(cData: any) {
    const savedData = await candle_model.create(cData);
    // consoleLogger.log('Data saved to Collection Candle : ' + data);
    return savedData;
}
async function saveDataToCandleLogCollection(logMessage: string) {
    let date = new Date().toISOString();
    const data = await log_message.create({log_time:date, logMessage});
    // consoleLogger.log('Data saved to Collection CandleLog : ' + data);
}


async function getAllData() {
    // consoleLogger.log("getAllData - connectDB ")
    // 레퍼런스 전체 데이터 가져오기
    try {
        const All_candle_data = await candle_model.find();
        return All_candle_data;
    } catch (error:any) {
        errorLogger.log(error.toString());
    }
    // await candle_model.find().then((candleData: Object) => {
    //     // consoleLogger.log('--- Read all ---');

    //     // consoleLogger.log(candleData.toString());
        
    //     // disconnectDB();
    // }).catch((err: Error) => {
    //     errorLogger.log(err.toString());
    // });
}

async function getRangeData(p_start_time:Date, p_end_time:Date) {
    try {
        const Range_candle_data = await candle_model.find({ $and: [{ start_time: { $gte: p_start_time } }, { end_time: { $lte: p_end_time } }] })
        return Range_candle_data;
    } catch (error: any) {
        errorLogger.log(error.toString());
    }
}

function disconnectDB() {
    if (dbConnectFlag) {
        async () => { await mongoose.disconnect(); }
        consoleLogger.log("Now disconnected!!")
    } else {
        consoleLogger.log("DB is not connected!")
    }
}

// connectDB(connectionString);
// getAllData();

export {
    connectDB,
    disconnectDB,
    // insertData,
    getAllData,
    getRangeData,
    saveDataToCandleCollection,
    saveDataToCandleLogCollection
};