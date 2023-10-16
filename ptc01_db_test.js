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
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
const mongoUser = 'dnsever';
const mongoUserPw = 'dnsever_pw';
const databaseUrl = 'mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/candles';
var dbConnectFlag = false;
function connectDB() {
    // const dbClient = require('mongodb').MongoClient;
    mongoose.connect(databaseUrl);
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
// 6. Schema 생성. (혹시 스키마에 대한 개념이 없다면, 입력될 데이터의 타입이 정의된 DB 설계도 라고 생각하면 됩니다.)
var student = mongoose.Schema({
    name: { type: String, unique: true },
    address: { type: String, unique: true },
    age: { type: Number }
});
const candleSchema = mongoose.Schema({
    market_id: { type: String, unique: true },
    open: { type: Number },
    close: { type: Number },
    low: { type: Number },
    high: { type: Number },
    base_volume: { type: Number },
    quote_volume: { type: Number },
    start_time: { type: String, unique: true },
    end_time: { type: String, unique: true }
});
// 7. 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
var Student = mongoose.model('Schema', student);
var candle_data = mongoose.model('Schema', candleSchema);
function inserCandleData(json_candle_data) {
    return __awaiter(this, void 0, void 0, function* () {
        // 8. Student 객체를 new 로 생성해서 값을 입력
        var new_candle_data = new candle_data(json_candle_data);
        // 9. 데이터 저장
        yield new_candle_data.save().then(() => {
            // res.status(200).json({
            //   success: true
            // });
            console.log("success");
        }).catch((err) => {
            // res.json({ success: false, err });
            console.log("fail!!", err);
        });
    });
}
function insertData() {
    // 8. Student 객체를 new 로 생성해서 값을 입력
    var newStudent = new Student({ name: 'Choi Gil Dong', address: '서울시 강남구 삼성동', age: '23' });
    // 9. 데이터 저장
    newStudent.save().then(() => {
        // res.status(200).json({
        //   success: true
        // });
        console.log("success");
    }).catch((err) => {
        // res.json({ success: false, err });
        console.log("fail!!", err);
    });
}
function getAllData() {
    // connectDB();
    // console.log("getAllData - connectDB ")
    // 10. Student 레퍼런스 전체 데이터 가져오기
    Student.find().then((students) => {
        console.log('--- Read all ---');
        console.log(students);
        disconnectDB();
    }).catch((err) => {
        console.log(err);
    });
}
function disconnectDB() {
    if (dbConnectFlag) {
        mongoose.disconnect();
        console.log("Now disconnected!!");
    }
    else {
        console.log("DB is not connected!");
    }
}
// mongoose.disconnect();
connectDB();
insertData();
getAllData();
// disconnectDB();
