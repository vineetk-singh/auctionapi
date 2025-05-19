import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { swaggerUi, specs } from './swagger.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import setupRoutes from './routes/setupRoutes.js';
import cors from 'cors';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import cookieParser from 'cookie-parser';


dotenv.config();

const logDir = 'logs';
const filename = path.basename(new URL(import.meta.url).pathname);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) =>
      JSON.stringify({ timestamp, level, message, file: filename })
    )
  ),
  transports: [
    new DailyRotateFile({
      dirname: logDir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    new winston.transports.Console()
  ]
});

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }));

app.use(express.json());

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        body: req.body,
      }));
    });
    next();
  });

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});



// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/setup', setupRoutes);

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  logger.info('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('DB connection error:', err));