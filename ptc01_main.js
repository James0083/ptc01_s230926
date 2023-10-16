"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectInSet = exports.saveInDB = exports.monitoring_responseJSON = exports.sendGetRequest = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const got_1 = __importDefault(require("got"));
const ptc01_logger_1 = require("./ptc01_logger");
const ptc01_db_1 = require("./ptc01_db");
const ptc01_slack_web_hook_1 = require("./ptc01_slack_web_hook");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const mongoUser = 'dnsever';
const mongoUserPw = 'dnsever_pw';
const connectionString = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;
//DB 연결
(0, ptc01_db_1.connectDB)(connectionString);
let cnt = 0;
let retry_cnt = 0;
let candleDataSet = new Set();
// const interval:string = '1m';
// const sort:string = 'desc';
// const limit: number = 1;
//public API에 요청, return response.body.data
function sendGetRequest(start_time, end_time, interval = '1m', sort = 'desc', limit = 11) {
    return __awaiter(this, void 0, void 0, function* () {
        let candle_api_url = 'https://api.probit.com/api/exchange/v1/candle?market_ids=BTC-USDT&start_time='
            + start_time + '&end_time=' + end_time + '&interval=' + interval
            + '&sort=' + sort + '&limit=' + limit;
        try {
            const response = yield (0, got_1.default)(candle_api_url, {
                responseType: 'json'
            });
            ptc01_logger_1.consoleLogger.log('statusCode : ' + response.statusCode);
            let rBody = JSON.parse(JSON.stringify(response.body));
            let rBodyData = rBody.data;
            monitoring_responseJSON(rBodyData);
            // consoleLogger.log(rBodyData.length);
            saveInDB(rBodyData);
            // candleDataSet.forEach(obj => consoleLogger.log(obj));
            ptc01_logger_1.consoleLogger.log('candleDataSet Size: ' + candleDataSet.size);
            ptc01_logger_1.consoleLogger.log("==============cnt: " + (++cnt) + "==============");
            // saveDataToCandleLogCollection("success!");
            return new Promise((resolve) => {
                // resolve(response.body);
                resolve(response);
                // resolve(rBodyData);
            });
        }
        catch (error) {
            let errorString = '[SendGetRequest Error] ' + error;
            (0, ptc01_db_1.saveDataToCandleLogCollection)(errorString);
            ptc01_logger_1.errorLogger.log(errorString);
            retry_cnt += 1;
            return new Promise((rejects) => {
                rejects(error);
            });
        }
    });
}
exports.sendGetRequest = sendGetRequest;
//모니터링 로그
function monitoring_responseJSON(rBodyData) {
    // let rBodyData=responseBody.data;
    // consoleLogger.log(rBodyData.length);
    ptc01_logger_1.consoleLogger.log('Response body data times:' + rBodyData[0].start_time + '~~~' + rBodyData[rBodyData.length - 1].end_time);
}
exports.monitoring_responseJSON = monitoring_responseJSON;
//DB저장 
function saveInDB(rBodyData) {
    let skip_cnt = 0;
    for (let cData of rBodyData) {
        //동일한 데이터가 Set에 있는지 확인
        if (!isObjectInSet(candleDataSet, cData)) {
            try {
                (0, ptc01_db_1.saveDataToCandleCollection)(cData);
                candleDataSet.add(cData);
            }
            catch (error) {
                ptc01_logger_1.errorLogger.log("Duplicate data. Skipping...");
            }
        }
        else {
            // consoleLogger.log("Duplicate data. Skipping...");
            skip_cnt += 1;
        }
    }
    ptc01_logger_1.consoleLogger.log("Duplicate data Skipped : " + skip_cnt);
    skip_cnt = 0;
}
exports.saveInDB = saveInDB;
let date;
//Batch 실행
const requestBatch = node_schedule_1.default.scheduleJob('0 * * * * *', () => {
    date = new Date();
    date.setMilliseconds(1);
    date.setSeconds(1);
    let end_time = date.toISOString();
    date.setMinutes(date.getMinutes() - 10);
    let start_time = date.toISOString();
    ptc01_logger_1.consoleLogger.log('running...');
    ptc01_logger_1.consoleLogger.log('request time : ' + start_time + '~' + end_time);
    let response = sendGetRequest(start_time, end_time).then((responseData) => {
        // consoleLogger.log("response:", response.body);
        // sendSlackNotification('test success message~ \n' + JSON.stringify(responseData));
    }).catch((error) => {
        let errString = "[requestBatch Error] " + error;
        ptc01_logger_1.errorLogger.log(errString);
        (0, ptc01_slack_web_hook_1.sendSlackNotification)(errString);
    });
    if (response.statusCode != 200) {
        retry_cnt += 1;
    }
    if (response.statusCode == 500)
        yield sleep(3000);
    else if (response.statusCode == 502)
        yield sleep(3000);
    else if (response.statusCode == 504)
        yield sleep(3000);
    if (retry_cnt > 3) {
        retry_cnt = 0;
        return;
    }
});
//중복검사 (Set)
function isObjectInSet(set, targetObj) {
    let found = false;
    set.forEach(obj => {
        if (obj.market_id === targetObj.market_id && obj.open === targetObj.open && obj.close === targetObj.close
            && obj.low === targetObj.low && obj.high === targetObj.high
            && obj.base_volume === targetObj.base_volume && obj.quote_volume === targetObj.quote_volume
            && obj.start_time === targetObj.start_time && obj.end_time === targetObj.end_time) {
            found = true;
            return; // Break the loop early since we found a match
        }
    });
    return found;
}
exports.isObjectInSet = isObjectInSet;
//Batch 종료 
setTimeout(() => {
    requestBatch.cancel();
    // getAllData();
    (0, ptc01_db_1.disconnectDB)();
    // setTimeout(disconnectDB(),5000);
}, 1000 * 60 * 60 * 3); //ms 후 종료
