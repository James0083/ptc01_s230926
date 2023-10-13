// import { candleSchema } from "./ptc01_schema";

var mongoose = require('mongoose');
const mongoUser: string = 'dnsever';
const mongoUserPw: string = 'dnsever_pw';
// const connectionString: string = 'mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/candles';
const connectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;
var dbConnectFlag: boolean = false;

function connectDB(connectionString:string) {
    // const dbClient = require('mongodb').MongoClient;
    mongoose.connect(connectionString);

    var db = mongoose.connection;
    // 연결 실패
    db.on('error', function () {
        console.log('Connection Failed!');
    });
    // 연결 성공
    db.once('open', function () {
        dbConnectFlag = true;
        console.log('Connected!');
    });
}

const candleSchema = mongoose.Schema({
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

var candle_data = mongoose.model('Schema', candleSchema);

async function insertData(json_candle_data: any) {
    // 8. Student 객체를 new 로 생성해서 값을 입력
    var new_candle_data = new candle_data(json_candle_data);

    // 9. 데이터 저장
    await new_candle_data.save().then(() => {
        
        console.log("success");
    }).catch((err: Error) => {

        console.log("fail!!", err);
    });
}

function getAllData() {
    // connectDB();
    // console.log("getAllData - connectDB ")
    // 10. Student 레퍼런스 전체 데이터 가져오기
    candle_data.find().then((candle_data: Object) => {
        console.log('--- Read all ---');

        console.log(candle_data);
        
        // disconnectDB();
    }).catch((err: Error) => {
        console.log(err);
    });

}

function disconnectDB() {
    if (dbConnectFlag) {
        mongoose.disconnect();
        console.log("Now disconnected!!")
    } else {
        console.log("DB is not connected!")
    }
}

// function insertLog(message:string) {
//     message.save()
// }

// connectDB();
// getAllData();

module.exports = { connectDB, disconnectDB, insertData, getAllData };