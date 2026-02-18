import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }), 
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export const llmLogger = {
  logPrompt(prompt: string, schemeId: string): void {
    logger.debug('LLM Prompt', {
      schemeId,
      promptLength: prompt.length,
      timestamp: new Date().toISOString(),
    });
  },

  logResponse(response: string, duration: number): void {
    logger.debug('LLM Response', {
      responseLength: response.length,
      duration,
      timestamp: new Date().toISOString(),
    });
  },

  logError(error: Error, context: string): void {
    logger.error('LLM Error', {
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
    });
  },
};