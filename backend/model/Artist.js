const { DataTypes } = require('sequelize');
const sequelize = require('../Database');

const Artist = sequelize.define('Artist', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  monthlyListeners: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  albums: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  upcomingShows: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  socialMedia: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

module.exports = Artist; 