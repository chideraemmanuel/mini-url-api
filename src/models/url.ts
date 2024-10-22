import mongoose, { model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    url_id: {
      type: String,
      required: true,
      unique: true,
    },
    destination_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const URL = model('URL', schema);

export default URL;
