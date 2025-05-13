import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  article: {
    title: String,
    description: String,
    url: { type: String, required: true },
    urlToImage: String,
    publishedAt: String,
    source: {
      id: String,
      name: String
    }
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

const History = mongoose.model('History', historySchema);
export default History;
