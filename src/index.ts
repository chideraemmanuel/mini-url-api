import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import './config/database';
import cors from 'cors';
import { errorHandler, notFound } from './middlewares/error-handlers';
import router from './routes';

const app = express();

const port = process.env.PORT || 5001;

app.use(morgan('dev'));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

// error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server started and is listening on http://localhost:${port}`)
);
