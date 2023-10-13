import schedule from 'node-schedule';
import got from "got";
import { cache } from './ptc01_cache';
import { consoleLogger } from './ptc01_logger';
import { rejects } from 'assert';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const { connectDB, disconnectDB, insertData, getAllData } = require('./ptc01_db');
const mongoUser: string = 'dnsever';
const mongoUserPw: string = 'dnsever_pw';
// const connectionString: string = 'mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/candles';
const connectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;

connectDB(connectionString);

let cnt: number = 0;
let retry_cnt: number = 0;

// const interval:string = '1m';
// const sort:string = 'desc';
// const limit: number = 1;

async function sendGetRequest(start_time: string, end_time: string, interval: string = '1m'
    , sort: string = 'desc', limit: number = 11) {
    
    let candle_api_url: string = 'https://api.probit.com/api/exchange/v1/candle?market_ids=BTC-USDT&start_time='
        + start_time + '&end_time=' + end_time + '&interval=' + interval
        + '&sort=' + sort + '&limit=' + limit;
    
    try {
        const response = await got(candle_api_url, {
            responseType: 'json'
        });

        consoleLogger.log('statusCode : ' + response.statusCode);

        let rBody = JSON.parse(JSON.stringify(response.body));
        monitoring_responseJSON(rBody);
        let rBodyData = rBody.data;
        
        insertData(rBodyData[0]);
        // insertData(rBodyData[1]);

        // console.log('Response body:', response.body);
        // console.log('Response body data:', rBodyData[0].start_time, '+++' , rBodyData[1].start_time);

        consoleLogger.log("cnt: " + (++cnt) + "==============");
        // return rBodyData;
        return new Promise((resolve) => {
            resolve(response);
        })
        
    } catch (error) {
        console.error('Error:', error);
        return new Promise((rejects) => {
            rejects(error);
        })
    }
}

function monitoring_responseJSON(responseBody: any) {
    let rBodyData=responseBody.data;
    consoleLogger.log('Response body data:'+ rBodyData[0].start_time + '+++' + rBodyData[1].start_time);
}

let date;
// const requestBatch = schedule.scheduleJob('0 */10 * * * *', () => {
const requestBatch = schedule.scheduleJob('* * * * * *', () => {
    date = new Date();
    date.setMilliseconds(1);
    date.setSeconds(1);
    let end_time = date.toISOString();
    date.setMinutes(date.getMinutes() - 10);
    let start_time = date.toISOString();
    console.log('running... / start: ' + start_time + '/ end: '+ end_time);
    sendGetRequest(start_time, end_time).then((response) => {
        // console.log("response:", response);
    }).catch((error) => {
        console.log("error: ", error);
    });

    // if(response.statusCode!=200) { retry_cnt+=1; }
    // if (response.statusCode == 500) await sleep(3000);
    // else if (response.statusCode == 502) await sleep(3000);
    // else if (response.statusCode == 504) await sleep(3000);

    if (retry_cnt > 3) {
        retry_cnt = 0;
        return;
    }
    // setTimeout(() => console.log("cnt: "+(++cnt)+"=============="), 2000);
})

setTimeout(() => {
    requestBatch.cancel()
    getAllData();
    
    // setTimeout(disconnectDB(),5000);
}, 4000); //4초 후 종료

    