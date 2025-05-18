import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  newsUrl: { type: String, required: true, unique: true },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Reaction = mongoose.model('Reaction', reactionSchema);
export default Reaction;
