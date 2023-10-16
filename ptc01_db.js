"use strict";
// import { candleSchema } from "./ptc01_schema";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDataToCandleLogCollection = exports.saveDataToCandleCollection = exports.getAllData = exports.disconnectDB = exports.connectDB = void 0;
const ptc01_logger_1 = require("./ptc01_logger");
// var mongoose = require('mongoose');
const mongoose_1 = __importStar(require("mongoose"));
// import { candle_data } from "./ptc01_schema";
const mongoUser = 'dnsever';
const mongoUserPw = 'dnsever_pw';
// const connectionString: string = 'mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/candles';
const connectionString = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;
var dbConnectFlag = false;
let candleDataSet = new Set();
function connectDB(connectionString) {
    // const dbClient = require('mongodb').MongoClient;
    mongoose_1.default.connect(connectionString);
    var db = mongoose_1.default.connection;
    // 연결 실패
    db.on('error', function () {
        ptc01_logger_1.consoleLogger.log('Connection Failed!');
    });
    // 연결 성공
    db.once('open', function () {
        dbConnectFlag = true;
        ptc01_logger_1.consoleLogger.log('Connected!');
    });
}
exports.connectDB = connectDB;
const candleSchema = new mongoose_1.Schema({
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
var candle_data = mongoose_1.default.model('Candle', candleSchema);
;
const LogSchema = new mongoose_1.Schema({
    log_time: { type: String, required: true },
    logMessage: { type: String, required: true }
});
var log_message = mongoose_1.default.model('CandleLog', LogSchema);
function saveDataToCandleCollection(cData) {
    return __awaiter(this, void 0, void 0, function* () {
        yield candle_data.create(cData);
        // consoleLogger.log('Data saved to Collection Candle : ' + data);
    });
}
exports.saveDataToCandleCollection = saveDataToCandleCollection;
function saveDataToCandleLogCollection(logMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        let date = new Date().toISOString();
        const data = yield log_message.create({ log_time: date, logMessage });
        // consoleLogger.log('Data saved to Collection CandleLog : ' + data);
    });
}
exports.saveDataToCandleLogCollection = saveDataToCandleLogCollection;
function getAllData() {
    // consoleLogger.log("getAllData - connectDB ")
    // 레퍼런스 전체 데이터 가져오기
    candle_data.find().then((candle_data) => {
        ptc01_logger_1.consoleLogger.log('--- Read all ---');
        ptc01_logger_1.consoleLogger.log(candle_data.toString());
        // disconnectDB();
    }).catch((err) => {
        ptc01_logger_1.errorLogger.log(err.toString());
    });
}
exports.getAllData = getAllData;
function disconnectDB() {
    if (dbConnectFlag) {
        mongoose_1.default.disconnect();
        ptc01_logger_1.consoleLogger.log("Now disconnected!!");
    }
    else {
        ptc01_logger_1.consoleLogger.log("DB is not connected!");
    }
}
exports.disconnectDB = disconnectDB;
