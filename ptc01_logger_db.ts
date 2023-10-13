
var mongoose = require('mongoose');
// var mongoUser = require('./ptc01_db')
// const mongoUserPw: string = 'dnsever_pw';
// const connectionString: string = 'mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/candles';
const LogDBconnectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candleLog`;
var dbConnectFlag: boolean = false;

const LogSchema = mongoose.Schema({
    logMessage: { type: String},
});

var log_message = mongoose.model('Schema', LogSchema);

async function insertLog(json_log_message: string) {
    // 8. Student 객체를 new 로 생성해서 값을 입력
    var new_log_message = new log_message(json_log_message);

    // 9. 데이터 저장
    await new_log_message.save().then(() => {
        console.log("success");
    }).catch((err: Error) => {
        console.log("fail!!", err);
    });
}

function getAllLogs() {
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

// function disconnectDB() {
//     if (dbConnectFlag) {
//         mongoose.disconnect();
//         console.log("Now disconnected!!")
//     } else {
//         console.log("DB is not connected!")
//     }
// }

// function insertLog(message:string) {
//     message.save()
// }

// connectDB();
// getAllData();

module.exports = { connectDB, disconnectDB, insertData, getAllData };