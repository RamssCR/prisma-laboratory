import { ALLOWED_ORIGINS, NODE_ENV, PORT } from '#config/environment';
import express, { json, urlencoded } from 'express';
import { basename } from 'node:path';
import { cors } from '#middlewares/cors';
import { fileURLToPath } from 'node:url';
import { errorHandler } from '#middlewares/errorHandler';
import { errorPath } from '#middlewares/errorPath';
import helmet from 'helmet';
import { limiter } from '#middlewares/limit';
import { logger } from '#utils/logger';
import parser from 'cookie-parser';
import { prisma } from '#config/db';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(helmet());
app.use(parser());
app.use(cors({ skip: NODE_ENV === 'development', origins: ALLOWED_ORIGINS }));
app.use(limiter(NODE_ENV === 'development'));

/**
 * Middleware to log requests that hit the API.
 * This will log the HTTP method and URL of each request.
 */
app.use((req, _res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
});

/**
 * Health check endpoint to verify that the server is running.
 * Responds with a JSON object containing the status and uptime.
 */
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    date: new Date(),
  });
});

app.use(errorPath);
app.use(errorHandler);

if (
  basename(fileURLToPath(import.meta.url)) === basename(process.argv[1]) &&
  NODE_ENV !== 'test'
) {
  prisma();
  app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
}

export { app };
