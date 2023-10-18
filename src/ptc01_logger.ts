const { connectDB, disconnectDB, insertLog, saveDataToCandleLogCollection, LogDBconnectionString } = require('./services/ptc01_db');

interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  async log(message: string) {
    await console.log(message);
  }
}

class ErrorLogger implements Logger{
  async log(message: string): Promise<void>{
    console.error(message);
    connectDB(LogDBconnectionString);
    await saveDataToCandleLogCollection(message);
    disconnectDB();
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