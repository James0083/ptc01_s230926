const mongoUser: string = 'dnsever';
const mongoUserPw: string = 'dnsever_pw';
// const connectionString: string = 'mongodb://' + mongoUser + ':' + mongoUserPw + '@localhost:27017/candles';
const connectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candle`;
const LogDBconnectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/candlelog`;

export { connectionString, LogDBconnectionString };