const express = require('express');
const router = express.Router();
const artistController = require('../Controller/artistController');
const { requireAdmin } = require('../middleware/auth');

// Public routes (anyone can view)
router.get('/', artistController.getArtists);
router.get('/search', artistController.searchArtists);
router.get('/featured', artistController.getFeaturedArtists);
router.get('/genre/:genre', artistController.getArtistsByGenre);
router.get('/:id', artistController.getArtistById);

// Admin-only routes (require admin authentication)
router.post('/', requireAdmin, artistController.createArtist);
router.put('/:id', requireAdmin, artistController.updateArtist);
router.delete('/:id', requireAdmin, artistController.deleteArtist);

module.exports = router; 