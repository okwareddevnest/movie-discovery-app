const express = require('express');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(auth);

// Get favorites and add a favorite
router.route('/')
  .get(getFavorites)
  .post(addFavorite);

// Remove from favorites
router.delete('/:id', removeFavorite);

module.exports = router; 