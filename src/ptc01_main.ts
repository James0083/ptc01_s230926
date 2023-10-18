import schedule from 'node-schedule';
import got from "got";
import { cache } from './ptc01_cache';
import { consoleLogger, errorLogger } from './ptc01_logger';
import { rejects } from 'assert';
import { candle_data, connectDB, disconnectDB, saveDataToCandleCollection, saveDataToCandleLogCollection } from './services/ptc01_db';
import { sendSlackNotification } from './ptc01_slack_web_hook';
import { connectionString, LogDBconnectionString } from "./DBconfig";
// import { parseString } from 'xml2js';

//DB 연결

let XMLcacheData: any = null;
let JSONcacheData: any = null;


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// const parseXml = (xmlData: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     parseString(xmlData, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };


let cnt: number = 0;
let retryLeft: number = 3;
const MAX_RETRIES = 3;
const RETRY_INTERVALS = [10 * 1000, 20 * 1000, 30 * 1000];
const BATCH_INTERVAL = 10;

let candleDataSet: Set<candle_data> = new Set<candle_data>();
let beforeCDataSetSize = 0;


//public API에 요청, return response.body.data
async function sendGetRequest(start_time: string, end_time: string, interval: string = '1m'
    , sort: string = 'desc', limit: number = BATCH_INTERVAL+1) {
    
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
        
        return new Promise((resolve) => {
            // resolve(response.body);
            resolve(rBodyData);
        })
        
    } catch (error) {
        let errorString = `[SendGetRequest Error(retry:${MAX_RETRIES - retryLeft + 1})] ${error}`;
        await saveDataToCandleLogCollection(errorString);
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
    consoleLogger.log('Response body data times:'+ rBodyData[0].start_time + '~~~' + rBodyData[rBodyData.length-1].end_time);
}

//DB저장 
async function saveInDB(rBodyData: any) {
    let skip_cnt = 0;
    for (let cData of rBodyData) {
        //동일한 데이터가 Set에 있는지 확인
        if (!isObjectInSet(candleDataSet, cData)) {
            try {
                await saveDataToCandleCollection(cData);
                // await saveDataToCandleLogCollection("save the cData!!"+ cData);
                candleDataSet.add(cData);
                // candleDataSet.forEach(obj => consoleLogger.log(obj));
                
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
    let afterCDataSetSize = candleDataSet.size;
    consoleLogger.log(`candleDataSet Size: ${afterCDataSetSize} (added ${afterCDataSetSize - beforeCDataSetSize})`);
    beforeCDataSetSize = afterCDataSetSize;
    // saveDataToCandleLogCollection("success!");
}

let date;
//Batch 실행
// const requestBatch = schedule.scheduleJob(`0 */${BATCH_INTERVAL} * * * *`, async () => {
//     await FetchJob(MAX_RETRIES);
// });

async function FetchJob(retryLeft: number): Promise<void> {
    date = new Date();
    date.setMilliseconds(1);
    date.setSeconds(1);
    const end_time = date.toISOString();
    date.setMinutes(date.getMinutes() - 1 - BATCH_INTERVAL);
    const start_time = date.toISOString();
    
    consoleLogger.log("\n==============cnt: " + (++cnt) + "==============");
    consoleLogger.log('running...');
    consoleLogger.log('request time : ' + start_time + '~' + end_time);
    // saveDataToCandleLogCollection('request time : ' + start_time + '~' + end_time);
    
    try {
        const responseBodyData = await sendGetRequest(start_time, end_time);
        await saveInDB(responseBodyData);
    } catch (error: any) {
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
            await sleep(retryInterval).then(async() => await FetchJob(retryLeft - 1));
        } else {
            // retryLeft = MAX_RETRIES;
            consoleLogger.log('Non-retryable error. Stopping retries.');
        }
    }

    if (retryLeft <= 0) {
        // retryLeft = MAX_RETRIES;
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
// TODO: 일단 삭제
// setTimeout(() => {
//     requestBatch.cancel()
//     // getAllData();
//     disconnectDB();
//     // setTimeout(disconnectDB(),5000);
// }, 1000*60*60*3).unref(); //ms 후 종료

const ptc01_main = async function () { 
    
    console.log("start connectDB(connectionString):", connectionString)
    await connectDB(connectionString);
    console.log("end connectDB(connectionString)")

    const requestBatch = schedule.scheduleJob(`0 */${BATCH_INTERVAL} * * * *`, async () => {
        await FetchJob(MAX_RETRIES);
    });

}


export {
    sendGetRequest,
    monitoring_responseJSON,
    saveInDB,
    isObjectInSet,
    // requestBatch
    ptc01_main
}

// module.exports = { ptc01_main };