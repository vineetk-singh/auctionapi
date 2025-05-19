import jwt from 'jsonwebtoken';
import winston from 'winston';
import 'winston-daily-rotate-file';

// Configure rolling logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/auth-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.Console(),
  ],
});

export const authenticateJWT = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
      logger.warn('Unauthorized access attempt: No token provided');
      return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        logger.error(`JWT verification error: ${err.message}`);
        return res.sendStatus(403);
       } 
      req.user = user;
      logger.info(`User authenticated: ${user.username}`);
      next();
    });
  };

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    };
  };