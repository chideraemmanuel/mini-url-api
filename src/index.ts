import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';
// import { nanoid, customAlphabet } from 'nanoid';
import URL from './models/url';

const app = express();

const port = process.env.PORT || 5001;

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log('Connnected to database!'))
  .catch((error) => {
    console.log('[DATABASE_CONNECTION_ERROR]', error);
    process.exit(1);
  });

app.use(morgan('tiny'));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.post('/', async (request: express.Request, response: express.Response) => {
  const { url } = request.body;

  if (!url) {
    return response.status(400).json({ error: 'No URL was provided.' });
  }

  // check if url is a valid url
  const url_regex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  if (!url_regex.test(url)) {
    return response.status(400).json({ error: 'Invalid URL.' });
  }

  // use dynamic import as nanoid doesn't support compiled commonjs module
  const { customAlphabet } = await import('nanoid');

  const nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    5
  );

  const url_id = nanoid();

  const url_record = await URL.create({
    url_id,
    destination_url: url,
  });

  console.log('url_record', url_record);

  return response.json({ short_url: `${process.env.API_BASE_URL}/${url_id}` });
});

app.get(
  '/:id',
  async (request: express.Request, response: express.Response) => {
    const { id } = request.params;

    const url_record = await URL.findOne({ url_id: id });

    if (!url_record) {
      return response.status(404).json({ error: 'No URL record found.' });
    }

    response.redirect(url_record.destination_url);
  }
);

app.use(
  (
    error: any,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    return response.status(error.status || 500).json({
      error: error.message || 'Something went wrong',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
);

app.use((_, response) =>
  response.status(404).json({
    error: "Couldn't find this endpoint. Refer to docs for valid endpoints.",
  })
);

app.listen(port, () =>
  console.log(`Server started and is listening on http://localhost:${port}`)
);
