import schedule from 'node-schedule';

let hello: string = 'hello typescript';
let date;

const regulerExec = schedule.scheduleJob('*/1 * * * * *', () => {
    date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    console.log('running... / ' + date.toISOString());

})

setTimeout(() =>
    regulerExec.cancel()
    , 4000); //4초 후 종료
// regulerExec.cancel();