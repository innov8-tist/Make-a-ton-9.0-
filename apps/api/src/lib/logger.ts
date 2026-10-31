import pino from 'pino';

export const logger = pino({
  redact: {
    paths: ['password', '*.password', 'token', '*.token', 'cookie', '*.cookie', 'req.headers.cookie'],
    censor: '[REDACTED]',
  },
});
