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
const node_schedule_1 = __importDefault(require("node-schedule"));
const got_1 = __importDefault(require("got"));
let cnt = 0;
const interval = '1m';
const sort = 'desc';
const limit = 11;
function sendGetRequest(start_time, end_time) {
    return __awaiter(this, void 0, void 0, function* () {
        let candle_api_url = 'https://api.probit.com/api/exchange/v1/candle?market_ids=BTC-USDT&start_time='
            + start_time + '&end_time=' + end_time + '&interval=' + interval
            + '&sort=' + sort + '&limit=' + limit;
        try {
            const response = yield (0, got_1.default)(candle_api_url, {
                responseType: 'json'
            });
            console.log('Response body:', response.body);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
let date;
// const requestBatch = schedule.scheduleJob('0 */10 * * * *', () => {
const requestBatch = node_schedule_1.default.scheduleJob('0 * * * * *', () => {
    date = new Date();
    date.setMilliseconds(1);
    date.setSeconds(1);
    let end_time = date.toISOString();
    date.setMinutes(date.getMinutes() - 10);
    let start_time = date.toISOString();
    console.log('running... / start: ' + start_time + '/ end: ' + end_time);
    sendGetRequest(start_time, end_time);
    setTimeout(() => console.log("cnt: " + (++cnt) + "=============="), 2000);
});
// setTimeout(() => requestBatch.cancel(), 4000); //4초 후 종료
