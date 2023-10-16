import { sendGetRequest, monitoring_responseJSON, saveInDB, isObjectInSet } from './ptc01_main';
import { consoleLogger, errorLogger } from './ptc01_logger';
import { connectDB, disconnectDB, getAllData, saveDataToCandleCollection, saveDataToCandleLogCollection } from './ptc01_db';
import { sendSlackNotification } from './ptc01_slack_web_hook';
import axios from 'axios';

jest.mock('axios');

describe('sendGetRequest', () => {
    it('fetches candle data from the API', async () => {
        // Mocked response from the API
        const mockedResponse = [
            {
                "market_id": "BTC-USDT", "open": "27212", "close": "27212", "low": "27212", "high": "27212",
                "base_volume": "0.323327", "quote_volume": "8798.374324",
                "start_time": "2023-10-16T02:15:00.000Z", "end_time": "2023-10-16T02:16:00.000Z"
            },
            {
                "market_id": "BTC-USDT", "open": "27215.6", "close": "27223.3", "low": "27215.6", "high": "27223.3",
                "base_volume": "0.234765", "quote_volume": "6390.3549967",
                "start_time": "2023-10-16T02:16:00.000Z", "end_time": "2023-10-16T02:17:00.000Z"
            },
            {
                "market_id": "BTC-USDT", "open": "27228.2", "close": "27230", "low": "27228.2", "high": "27230",
                "base_volume": "0.195111", "quote_volume": "5312.6253756",
                "start_time": "2023-10-16T02:17:00.000Z", "end_time": "2023-10-16T02:18:00.000Z"
            },
            {
                "market_id": "BTC-USDT", "open": "27235", "close": "27236.4", "low": "27235", "high": "27236.4",
                "base_volume": "0.524784", "quote_volume": "14292.5506046",
                "start_time": "2023-10-16T02:18:00.000Z", "end_time": "2023-10-16T02:19:00.000Z"
            },
            {
                "market_id": "BTC-USDT", "open": "27239.7", "close": "27239.7", "low": "27239.7", "high": "27239.7",
                "base_volume": "0.234176", "quote_volume": "6378.8839872",
                "start_time": "2023-10-16T02:19:00.000Z", "end_time": "2023-10-16T02:20:00.000Z"
            },
            {
                "market_id": "BTC-USDT", "open": "27240.9", "close": "27247.8", "low": "27240.9", "high": "27247.8",
                "base_volume": "0.426699", "quote_volume": "11624.3310807",
                "start_time": "2023-10-16T02:20:00.000Z", "end_time": "2023-10-16T02:21:00.000Z"
            },
            {
                "market_id": "BTC-USDT", "open": "27250", "close": "27258.2", "low": "27250", "high": "27258.2",
                "base_volume": "0.606967", "quote_volume": "16541.5737012",
                "start_time": "2023-10-16T02:21:00.000Z", "end_time": "2023-10-16T02:22:00.000Z"
            },
            {
                "market_id": "BTC-USDT", "open": "27249.8", "close": "27247.5", "low": "27247.5", "high": "27249.8",
                "base_volume": "0.652173", "quote_volume": "17770.7505921",
                "start_time": "2023-10-16T02:22:00.000Z", "end_time": "2023-10-16T02:23:00.000Z"
            }
        ];
        const mongoUser: string = 'dnsever';
        const mongoUserPw: string = 'dnsever_pw';
        const connectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;

        //DB 연결
        await connectDB(connectionString);
      
        // Mock Axios.get to return the mocked response
        (axios.get as jest.Mock).mockResolvedValue({ data: mockedResponse });

        const candleData = await sendGetRequest('2023-10-16T02:13:01.001Z', '2023-10-16T02:23:01.001Z')
            .then()
            .catch((error) => {
                let errString = "[requestBatch Error] " + error
                errorLogger.log(errString);
                sendSlackNotification(errString);
            });
        expect(candleData).toEqual(mockedResponse);

        // disconnectDB();
        
    });
});

// describe('saveCandleData', () => {
//   it('saves candle data', async () => {
//     const candleData = [{ /* mocked candle data */ }];

//     // Mock any saving logic you may have
//     // For simplicity, we'll just check if the input data matches the output
//     const savedData = await saveCandleData(candleData);
//     expect(savedData).toEqual(candleData);
//   });
// });
