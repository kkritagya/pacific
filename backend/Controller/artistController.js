const { Op } = require('sequelize');
const Artist = require('../model/Artist');

exports.createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    await artist.update(req.body);
    res.json(artist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    await artist.destroy();
    res.json({ message: 'Artist deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getArtistsByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const artists = await Artist.findAll({
      where: { genre }
    });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeaturedArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      where: { isFeatured: true }
    });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchArtists = async (req, res) => {
  try {
    const { q } = req.query;
    const artists = await Artist.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { genre: { [Op.iLike]: `%${q}%` } }
        ]
      }
    });
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 