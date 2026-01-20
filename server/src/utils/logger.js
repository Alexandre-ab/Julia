import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Format personnalisé pour les logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
    if (stack) {
        return `${timestamp} [${level}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level}]: ${message}`;
});

// Création du logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Console output
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            ),
        }),
        // Fichier pour les erreurs
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        // Fichier pour tous les logs
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
    ],
});

// Si pas en production, logger aussi en format simple
if (process.env.NODE_ENV !== 'production') {
    logger.debug('🔍 Logger en mode développement');
}

export default logger;
