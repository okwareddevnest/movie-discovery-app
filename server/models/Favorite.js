const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  poster: {
    type: String
  },
  overview: {
    type: String
  },
  rating: {
    type: Number
  },
  releaseDate: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only favorite a movie once
favoriteSchema.index({ user: 1, movieId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite; 