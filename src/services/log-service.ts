type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogPayload {
  message: string;
  data?: unknown;
  error?: Error;
  component?: string;
}

class LogService {
  private log(level: LogLevel, { message, data, error, component }: LogPayload) {
    const timestamp = new Date().toISOString();
    const prefix = component ? `[${component}]` : '';
    
    console[level](
      `${timestamp} ${prefix} ${message}`,
      ...[data, error].filter(Boolean)
    );
  }

  error({ message, data, error, component }: LogPayload) {
    this.log('error', { message, data, error, component });
  }

  warn({ message, data, component }: LogPayload) {
    this.log('warn', { message, data, component });
  }

  info({ message, data, component }: LogPayload) {
    this.log('info', { message, data, component });
  }

  debug({ message, data, component }: LogPayload) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', { message, data, component });
    }
  }
}

export const logger = new LogService(); 