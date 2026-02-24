import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL })); // Make sure you have FRONTEND_URL in .env  (pending)
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, 
  message: 'Too many requests from this IP, please try again in 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,           
})
app.use('/api/accounts/login', rateLimit({
  windowMs: 15 * 60 * 1000, //
  max: 5, 
  message: 'Too many failed login attempts, please try again in 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false, 
}));

app.use('/api', limiter);


app.use('/api', routes);

                  //handling errors
app.use(errorHandler);

export default app;