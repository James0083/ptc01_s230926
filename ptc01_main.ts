import schedule from 'node-schedule';
import got from "got";
import { cache } from './ptc01_cache';
import { consoleLogger, errorLogger } from './ptc01_logger';
import { rejects } from 'assert';
// import { candle_data, connectDB, disconnectDB, insertData, getAllData, saveDataToCandleCollection, saveDataToCandleLogCollection } from './ptc01_db';
import { candle_data } from './ptc01_db';
import { connectDB, disconnectDB, getAllData, saveDataToCandleCollection, saveDataToCandleLogCollection } from './ptc01_db';
import { sendSlackNotification } from './ptc01_slack_web_hook';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mongoUser: string = 'dnsever';
const mongoUserPw: string = 'dnsever_pw';
const connectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;

//DB 연결
connectDB(connectionString);

let cnt: number = 0;
let retryLeft: number = 3;
const MAX_RETRIES = 3;
const RETRY_INTERVALS = [10 * 1000, 20 * 1000, 30 * 1000];

let candleDataSet: Set<candle_data> = new Set<candle_data>();

// const interval:string = '1m';
// const sort:string = 'desc';
// const limit: number = 1;

//public API에 요청, return response.body.data
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

        // 성공적인 응답인 경우
        if (response.statusCode === 200) {
        // 데이터를 저장하는 로직을 추가
            consoleLogger.log('Data fetched successfully.');
        } else {
            errorLogger.log(`Failed to fetch data. Status code: ${response.statusCode}`);
        }
            
        let rBody = JSON.parse(JSON.stringify(response.body));
        let rBodyData = rBody.data;
        monitoring_responseJSON(rBodyData);
        // consoleLogger.log(rBodyData.length);

        
        saveInDB(rBodyData);

        // candleDataSet.forEach(obj => consoleLogger.log(obj));
        consoleLogger.log('candleDataSet Size: ' + candleDataSet.size);
        consoleLogger.log("==============cnt: " + (++cnt) + "==============");
        // saveDataToCandleLogCollection("success!");
        // return new Promise((resolve) => {
        //     // resolve(response.body);
        //     resolve(response);
        //     // resolve(rBodyData);
        // })
        
    } catch (error) {
        let errorString = `[SendGetRequest Error] ${error}`;
        saveDataToCandleLogCollection(errorString);
        errorLogger.log(errorString);
        retryLeft -= 1;
        // return new Promise((rejects) => {
        //     rejects(error);
        // })
        throw error;
    }
}

//모니터링 로그
function monitoring_responseJSON(rBodyData: any) {
    // let rBodyData=responseBody.data;
    // consoleLogger.log(rBodyData.length);
    consoleLogger.log('Response body data times:'+ rBodyData[0].start_time + '~~~' + rBodyData[rBodyData.length-1].end_time);
}

//DB저장 
function saveInDB(rBodyData: any) {
    let skip_cnt = 0;
    for (let cData of rBodyData) {
        //동일한 데이터가 Set에 있는지 확인
        if (!isObjectInSet(candleDataSet, cData)) {
            try {
                saveDataToCandleCollection(cData);
                candleDataSet.add(cData);
            } catch (error) {
                errorLogger.log("Duplicate data. Skipping...");
            }
        }
        else {
            // consoleLogger.log("Duplicate data. Skipping...");
            skip_cnt += 1;
        }
    }
    consoleLogger.log("Duplicate data Skipped : " + skip_cnt);
    skip_cnt = 0;
}

let date;
//Batch 실행
const requestBatch = schedule.scheduleJob('0 * * * * *', () => {
    FetchJob(MAX_RETRIES);
});

async function FetchJob(retryLeft: number): Promise<void> {
    date = new Date();
    date.setMilliseconds(1);
    date.setSeconds(1);
    let end_time = date.toISOString();
    date.setMinutes(date.getMinutes() - 10);
    let start_time = date.toISOString();

    consoleLogger.log('running...');
    consoleLogger.log('request time : ' + start_time + '~' + end_time);
    
    /*
    if (retryLeft > 0) {
        consoleLogger.log(`Retrying (${MAX_RETRIES - retryLeft + 1}/${MAX_RETRIES})...`);
        let response = sendGetRequest(start_time, end_time).then((response:any) => {
        
        }).catch((error) => {
            let errString = "[requestBatch Error] " + error
            errorLogger.log(errString);
            sendSlackNotification(errString);
            
            let retryInterval = 0;
            if (error.message.includes('Status code: 500')){
                retryInterval = RETRY_INTERVALS[0];
            } else if (error.message.includes('Status code: 502')) {
                retryInterval = RETRY_INTERVALS[1];
            } else if(error.message.includes('Status code: 504')) {
                retryInterval = RETRY_INTERVALS[2];
            }

            if (retryInterval > 0) {
                consoleLogger.log(`Retrying in ${retryInterval / 1000} seconds...`);
                await sleep(retryInterval);
                await FetchJob(retryLeft - 1);
            } else {
                consoleLogger.log('Non-retryable error. Stopping retries.');
            }
        });
    } else {
        console.log('Maximum retries reached. Stopping retries.');
    }
    /**/
        
    
    
    /////////////////////////////
    let response = sendGetRequest(start_time, end_time).then((response:any) => {
        retryLeft = MAX_RETRIES;
    }).catch((error) => {
        let errString = "[requestBatch Error] " + error
        errorLogger.log(errString);
        sendSlackNotification(errString);
        
        let retryInterval = 0;
        if (error.message.includes('Status code: 500')){
            retryInterval = RETRY_INTERVALS[0];
        } else if (error.message.includes('Status code: 502')) {
            retryInterval = RETRY_INTERVALS[1];
        } else if(error.message.includes('Status code: 504')) {
            retryInterval = RETRY_INTERVALS[2];
        }

        if (retryInterval > 0) {
            consoleLogger.log(`Retrying in ${retryInterval / 1000} seconds...`);
            sleep(retryInterval).then(() => FetchJob(retryLeft - 1));
        } else {
            retryLeft = MAX_RETRIES;
            consoleLogger.log('Non-retryable error. Stopping retries.');
        }
    });


    if (retryLeft <= 0) {
        retryLeft = MAX_RETRIES;
        return;
    }
}

//중복검사 (Set)
function isObjectInSet(set: Set<candle_data>, targetObj: candle_data): boolean {
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

//Batch 종료 
setTimeout(() => {
    requestBatch.cancel()
    // getAllData();
    disconnectDB();
    // setTimeout(disconnectDB(),5000);
}, 1000*60*60*3); //ms 후 종료


export {
    sendGetRequest,
    monitoring_responseJSON,
    saveInDB,
    isObjectInSet
}