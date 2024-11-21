import mongoose from 'mongoose';

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log('Connnected to database!'))
  .catch((error) => {
    console.log('[DATABASE_CONNECTION_ERROR]', error);
    process.exit(1);
  });
