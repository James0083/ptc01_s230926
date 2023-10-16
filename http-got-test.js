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
const got_1 = __importDefault(require("got"));
function sendGetRequest(end_time) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const response = await got('https://candle.probit.com/candle?market_ids=BTC-USDT&start_time=1970-01-01T00%3A00%3A00.000Z&end_time=2023-09-27T00%3A33%3A13.000Z&interval=30m&sort=desc&limit=329', {
            const response = yield (0, got_1.default)('https://api.probit.com/api/exchange/v1/candle?market_ids=BTC-USDT&start_time=2022-12-31T00:30:00.000Z&end_time=2022-12-31T01:01:01.001Z&interval=1m&sort=desc&limit=12', {
                responseType: 'json'
            });
            let rBodyData = JSON.parse(JSON.stringify(response.body)).data;
            // let rbdata:Set<candle_data> = new Set<candle_>(JSON.parse(JSON.stringify(response.body)).data);
            // console.log('Response body:', response.body);
            // const setIterator = rb.entries();
            // while ( !setIterator.next().done ) {
            //   const [value1, value2] = setIterator.next().value;
            //   console.log(value1.start_time +' , ' +value2.end_time);
            // }
            // console.log('Response body Set : ', rb.size);
            // console.log('Response body parse JSON : ', rBody[0], rBody[1], typeof (rBody));
            console.log('response-statusCode : ', response.statusCode, typeof (response.statusCode));
            // console.log('response-statusMessage : ', response.statusMessage);
            // console.log('responses: ', response);
            console.log('Response body data type : ' + typeof (rBodyData));
            console.log('Response body data : ' + rBodyData);
            // console.log('Response body data : ', typeof(rb));
            // let c: candle_data = JSON.parse(response.body.data[0]);
            // console.log('Response body:', typeof(response.body));
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
sendGetRequest('');
