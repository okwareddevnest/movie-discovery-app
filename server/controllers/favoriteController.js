const Favorite = require('../models/Favorite');

// @desc    Add a movie to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { movieId, title, poster, overview, rating, releaseDate } = req.body;
    
    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      movieId
    });
    
    if (existingFavorite) {
      return res.status(400).json({ error: 'Movie already in favorites' });
    }
    
    const favorite = await Favorite.create({
      user: req.user._id,
      movieId,
      title,
      poster,
      overview,
      rating,
      releaseDate
    });
    
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      movieId: req.params.id,
      user: req.user._id
    });
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    await favorite.deleteOne();
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
}; 