const { connectDB, disconnectDB, insertLog, saveDataToCandleLogCollection } = require('./ptc01_db');

interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class ErrorLogger implements Logger{
    log(message: string): void{
        console.error(message);
        saveDataToCandleLogCollection(message);
    }
}

class FileLogger implements Logger {
  log(message: string): void {
    // 파일에 로그를 작성하는 로직
    console.log('Writing to file: ' + message);
  }
}

export const consoleLogger = new ConsoleLogger();
export const errorLogger = new ErrorLogger();