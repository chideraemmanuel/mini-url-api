import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import URL from 'models/url';
// import { nanoid, customAlphabet } from 'nanoid';
import URL from './models/url';
// import('nanoid')

dotenv.config();

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
    return response
      .status(400)
      .json({ error: 'Please supply the URL to be shortened' });
  }

  // check if url is a valid url
  const urlRegex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  if (!urlRegex.test(url)) {
    return response.status(400).json({ error: 'Please supply a valid URL' });
  }

  // use dynamic import as nanoid doesn't support compiled commonjs module
  const { nanoid, customAlphabet } = await import('nanoid');

  const url_id = nanoid(5);

  const urlRecord = await URL.create({
    url_id,
    destination_url: url,
  });

  console.log('urlRecord', urlRecord);

  return response.json({ short_url: `http://localhost:${port}/${url_id}` });
});

app.get(
  '/:id',
  async (request: express.Request, response: express.Response) => {
    const { id } = request.params;

    const urlRecord = await URL.findOne({ url_id: id });

    if (!urlRecord) {
      return response.status(404).json({ error: 'No URL record found.' });
    }

    response.redirect(urlRecord.destination_url);
  }
);

app.use(
  (
    error: any,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    return response
      .status(error.status || 500)
      .json({ error: error.message, stack: error.stack });
  }
);

app.listen(port, () =>
  console.log(`Server started and is listening on http://localhost:${port}`)
);
