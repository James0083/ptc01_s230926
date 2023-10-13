"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
let hello = 'hello typescript';
let date;
const regulerExec = node_schedule_1.default.scheduleJob('*/1 * * * * *', () => {
    date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    console.log('running... / ' + date.toISOString());
});
setTimeout(() => regulerExec.cancel(), 4000); //4초 후 종료
// regulerExec.cancel();
