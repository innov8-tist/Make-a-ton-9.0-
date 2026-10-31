import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { db } from './lib/db.js';
import { logger } from './lib/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { originCheck } from './middleware/origin-check.js';
import { authRouter } from './modules/auth/routes.js';
import { billingRouter } from './modules/billing/routes.js';
import { customersRouter } from './modules/customers/routes.js';
import { discountsRouter } from './modules/discounts/routes.js';
import { invoicesRouter } from './modules/invoices/routes.js';
import { paymentsRouter } from './modules/payments/routes.js';
import { plansRouter } from './modules/plans/routes.js';
import { productsRouter } from './modules/products/routes.js';
import { reportsRouter } from './modules/reports/routes.js';
import { subscriptionsRouter } from './modules/subscriptions/routes.js';
import { taxesRouter } from './modules/taxes/routes.js';
import { templatesRouter } from './modules/templates/routes.js';
import { usersRouter } from './modules/users/routes.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: env.WEB_URL, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json());
app.use(cookieParser());
app.use(originCheck);

const api = express.Router();
api.get('/health', async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.status(200).json({ data: { status: 'ok' } });
  } catch (error) {
    logger.warn({ err: error }, 'Database health check failed');
    res.status(503).json({ error: { code: 'SERVICE_UNAVAILABLE', message: 'Database unavailable' } });
  }
});

api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/customers', customersRouter);
api.use('/products', productsRouter);
api.use('/plans', plansRouter);
api.use('/templates', templatesRouter);
api.use('/subscriptions', subscriptionsRouter);
api.use('/taxes', taxesRouter);
api.use('/discounts', discountsRouter);
api.use('/invoices', invoicesRouter);
api.use('/payments', paymentsRouter);
api.use('/billing', billingRouter);
api.use('/reports', reportsRouter);

app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => logger.info({ port }, 'API server listening'));
