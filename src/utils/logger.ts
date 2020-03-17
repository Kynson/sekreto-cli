import { bold, cyan, red, yellow } from 'chalk';

type LogSeverity = 'error' | 'info' | 'warning';

interface Logger {
  error: (message: string, overridePreviousLine?: boolean) => void;
  native: (...message: any[]) => void;
  info: (message: string, overridePreviousLine?: boolean) => void;
  warning: (message: string, overridePreviousLine?: boolean) => void;
}

function log(message: string, serverity: LogSeverity, overridePreviousLine: boolean = false) {
  const prefix = serverity === 'error' ? red('✕') : serverity === 'info' ? cyan('i') : yellow('!');
  const logMessage = bold(message);

  if (overridePreviousLine) {
    process.stdout.cursorTo(0);
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(0);
  }

  process.stdout.write(`${prefix} ${logMessage}\n`);
}

export const logger: Logger = {
  error: (message: string, overridePreviousLine?: boolean) => log(message, 'error', overridePreviousLine),
  native: (...message: any[]) => console.log.call(this, message),
  info: (message: string, overridePreviousLine?: boolean) => log(message, 'info', overridePreviousLine),
  warning: (message: string, overridePreviousLine?: boolean) => log(message, 'warning', overridePreviousLine)
}
