// https://javafa.gitbooks.io/nodejs_server_basic/content/chapter12.html

// 1. mongoose 모듈 가져오기
var mongoose = require('mongoose');
// 2. testDB 세팅
const mongoUser = 'dnsever';
const mongoUserPw = 'dnsever_pw';
mongoose.connect('mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/');
// 3. 연결된 testDB 사용
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('Connected!');
});

// 6. Schema 생성. (혹시 스키마에 대한 개념이 없다면, 입력될 데이터의 타입이 정의된 DB 설계도 라고 생각하면 됩니다.)
var student = mongoose.Schema({
    name : 'string',
    address : 'string',
    age : 'number'
});

// 7. 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
var Student = mongoose.model('Schema', student);

// 8. Student 객체를 new 로 생성해서 값을 입력
var newStudent = new Student({name:'Kong Gil Dong', address:'서울시 강남구 역삼동', age:'22'});

// 9. 데이터 저장
newStudent.save().then(()=>{
    // res.status(200).json({
    //   success: true
    // });
    console.log("success");
  }).catch((err)=>{
    // res.json({ success: false, err });
    console.log("fail!!", err);
  });

// 10. Student 레퍼런스 전체 데이터 가져오기
Student.find().then((students) => {
    console.log('--- Read all ---');

    console.log(students);
}).catch((err) => {
    console.log(err);
});



setTimeout(()=>mongoose.disconnect(), 2000);


/*
console.log("start!");
var Client = require('mongodb').MongoClient;

Client.connect('mongodb://localhost:27017/testDB', function(error, db){
    if(error) {
        console.log("connecting fail" , error , "~~");
    } else {
        console.log("connected:"+db);
        db.close();
    }
});

console.log("end!!");
return 0;

*/