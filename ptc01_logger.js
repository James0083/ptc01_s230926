"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.consoleLogger = void 0;
const { connectDB, disconnectDB, insertLog, saveDataToCandleLogCollection } = require('./ptc01_db');
class ConsoleLogger {
    log(message) {
        console.log(message);
    }
}
class ErrorLogger {
    log(message) {
        console.error(message);
        saveDataToCandleLogCollection(message);
    }
}
class FileLogger {
    log(message) {
        // 파일에 로그를 작성하는 로직
        console.log('Writing to file: ' + message);
    }
}
exports.consoleLogger = new ConsoleLogger();
exports.errorLogger = new ErrorLogger();
