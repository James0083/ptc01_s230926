// import { candleSchema } from "./ptc01_schema";

import { consoleLogger, errorLogger } from "./ptc01_logger";

// var mongoose = require('mongoose');
import mongoose, {Schema, Document} from "mongoose";
// import { candle_data } from "./ptc01_schema";
const mongoUser: string = 'dnsever';
const mongoUserPw: string = 'dnsever_pw';
// const connectionString: string = 'mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/candles';
const connectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;
var dbConnectFlag: boolean = false;

let candleDataSet: Set<candle_data> = new Set<candle_data>();
    
function connectDB(connectionString:string) {
    // const dbClient = require('mongodb').MongoClient;
    mongoose.connect(connectionString);

    var db = mongoose.connection;
    // 연결 실패
    db.on('error', function () {
        consoleLogger.log('Connection Failed!');
    });
    // 연결 성공
    db.once('open', function () {
        dbConnectFlag = true;
        consoleLogger.log('Connected!');
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
  start_time: string;
  end_time: string;
}

const candleSchema: Schema = new Schema({
    market_id: { type: String, required: true },
    open: { type: Number, required: true },
    close: { type: Number, required: true },
    low: { type: Number, required: true },
    high: { type: Number, required: true },
    base_volume: { type: Number, required: true },
    quote_volume: { type: Number, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true }
});

// candleSchema.index({ market_id: 1, start_time: 1, end_time: 1 }, { unique: true });

var candle_data = mongoose.model<candle_data>('Candle', candleSchema);

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
    await candle_data.create(cData);
    // consoleLogger.log('Data saved to Collection Candle : ' + data);
}
async function saveDataToCandleLogCollection(logMessage: string) {
    let date = new Date().toISOString();
    const data = await log_message.create({log_time:date, logMessage});
    // consoleLogger.log('Data saved to Collection CandleLog : ' + data);
}


function getAllData() {
    // consoleLogger.log("getAllData - connectDB ")
    // 레퍼런스 전체 데이터 가져오기
    candle_data.find().then((candle_data: Object) => {
        consoleLogger.log('--- Read all ---');

        consoleLogger.log(candle_data.toString());
        
        // disconnectDB();
    }).catch((err: Error) => {
        errorLogger.log(err.toString());
    });

}

function disconnectDB() {
    if (dbConnectFlag) {
        mongoose.disconnect();
        consoleLogger.log("Now disconnected!!")
    } else {
        consoleLogger.log("DB is not connected!")
    }
}

// connectDB();
// getAllData();

export {
    connectDB,
    disconnectDB,
    // insertData,
    getAllData,
    saveDataToCandleCollection,
    saveDataToCandleLogCollection
};