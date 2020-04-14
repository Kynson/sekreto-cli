import { bold, cyan, red, yellow } from 'chalk';

type LogSeverity = 'error' | 'info' | 'warning';

interface ILogger {
  error: (message: string) => void;
  info: (message: string) => void;
  native: (...message: any[]) => void;
  warning: (message: string) => void;
}

function log(message: string, serverity: LogSeverity) {
  const prefix = serverity === 'error' ? red('✕') : (serverity === 'info' ? cyan('i') : yellow('!'));
  const logMessage = bold(message);

  console.log(`${prefix} ${logMessage}`);
}

export const logger: ILogger = {
  error: (message: string) => log(message, 'error'),
  info: (message: string) => log(message, 'info'),
  native: (...message: any[]) => console.log.call(this, message),
  warning: (message: string) => log(message, 'warning')
};
