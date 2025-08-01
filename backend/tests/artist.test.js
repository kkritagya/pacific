const request = require('supertest');
const express = require('express');
const artistRoutes = require('../route/artistRoutes');
const Artist = require('../model/Artist');

// Create test app
const app = express();
app.use(express.json());
app.use('/artists', artistRoutes);

describe('Artist Tests', () => {
  describe('GET /artists', () => {
    beforeEach(async () => {
      await testUtils.createTestArtist({ name: 'Artist 1' });
      await testUtils.createTestArtist({ name: 'Artist 2' });
      await testUtils.createTestArtist({ name: 'Artist 3' });
    });

    it('should get all artists', async () => {
      const response = await request(app)
        .get('/artists')
        .expect(200);

      expect(response.body).toHaveProperty('artists');
      expect(Array.isArray(response.body.artists)).toBe(true);
      expect(response.body.artists).toHaveLength(3);
    });

    it('should search artists by name', async () => {
      const response = await request(app)
        .get('/artists?search=Artist 1')
        .expect(200);

      expect(response.body).toHaveProperty('artists');
      expect(response.body.artists).toHaveLength(1);
      expect(response.body.artists[0].name).toBe('Artist 1');
    });
  });

  describe('GET /artists/:id', () => {
    let artist;

    beforeEach(async () => {
      artist = await testUtils.createTestArtist();
    });

    it('should get artist by id', async () => {
      const response = await request(app)
        .get(`/artists/${artist.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('artist');
      expect(response.body.artist.id).toBe(artist.id);
      expect(response.body.artist.name).toBe(artist.name);
    });

    it('should return 404 for non-existent artist', async () => {
      const response = await request(app)
        .get('/artists/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Artist not found');
    });
  });

  describe('POST /artists', () => {
    it('should create a new artist', async () => {
      const artistData = {
        name: 'New Artist',
        bio: 'New artist bio',
        imageUrl: 'new-artist.jpg',
        profile: {
          genre: 'Rock',
          location: 'Los Angeles',
          website: 'https://newartist.com'
        },
        discography: [
          {
            title: 'First Album',
            year: 2020,
            tracks: ['Song 1', 'Song 2', 'Song 3']
          }
        ]
      };

      const response = await request(app)
        .post('/artists')
        .send(artistData)
        .expect(201);

      expect(response.body).toHaveProperty('artist');
      expect(response.body.artist.name).toBe(artistData.name);
      expect(response.body.artist.bio).toBe(artistData.bio);
      expect(response.body.artist.profile).toEqual(artistData.profile);
      expect(response.body.artist.discography).toEqual(artistData.discography);
    });

    it('should return error for missing required fields', async () => {
      const artistData = {
        bio: 'Artist bio'
        // Missing name
      };

      const response = await request(app)
        .post('/artists')
        .send(artistData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error for duplicate artist name', async () => {
      const artistData = {
        name: 'Test Artist',
        bio: 'Test bio'
      };

      // Create first artist
      await request(app)
        .post('/artists')
        .send(artistData);

      // Try to create second artist with same name
      const response = await request(app)
        .post('/artists')
        .send(artistData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Artist with this name already exists');
    });
  });

  describe('PUT /artists/:id', () => {
    let artist;

    beforeEach(async () => {
      artist = await testUtils.createTestArtist();
    });

    it('should update artist successfully', async () => {
      const updateData = {
        name: 'Updated Artist',
        bio: 'Updated bio',
        profile: {
          genre: 'Jazz',
          location: 'New York'
        }
      };

      const response = await request(app)
        .put(`/artists/${artist.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('artist');
      expect(response.body.artist.name).toBe(updateData.name);
      expect(response.body.artist.bio).toBe(updateData.bio);
      expect(response.body.artist.profile).toEqual(updateData.profile);
    });

    it('should return 404 for non-existent artist', async () => {
      const updateData = {
        name: 'Updated Artist'
      };

      const response = await request(app)
        .put('/artists/99999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Artist not found');
    });

    it('should return error for duplicate name when updating', async () => {
      const otherArtist = await testUtils.createTestArtist({ name: 'Other Artist' });
      const updateData = {
        name: 'Other Artist'
      };

      const response = await request(app)
        .put(`/artists/${artist.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Artist with this name already exists');
    });
  });

  describe('DELETE /artists/:id', () => {
    let artist;

    beforeEach(async () => {
      artist = await testUtils.createTestArtist();
    });

    it('should delete artist successfully', async () => {
      const response = await request(app)
        .delete(`/artists/${artist.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Artist deleted successfully');

      // Verify artist is deleted
      const getResponse = await request(app)
        .get(`/artists/${artist.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent artist', async () => {
      const response = await request(app)
        .delete('/artists/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Artist not found');
    });
  });

  describe('GET /artists/:id/discography', () => {
    let artist;

    beforeEach(async () => {
      artist = await testUtils.createTestArtist({
        discography: [
          {
            title: 'First Album',
            year: 2020,
            tracks: ['Song 1', 'Song 2']
          },
          {
            title: 'Second Album',
            year: 2022,
            tracks: ['Song 3', 'Song 4', 'Song 5']
          }
        ]
      });
    });

    it('should get artist discography', async () => {
      const response = await request(app)
        .get(`/artists/${artist.id}/discography`)
        .expect(200);

      expect(response.body).toHaveProperty('discography');
      expect(Array.isArray(response.body.discography)).toBe(true);
      expect(response.body.discography).toHaveLength(2);
      expect(response.body.discography[0].title).toBe('First Album');
      expect(response.body.discography[1].title).toBe('Second Album');
    });

    it('should return 404 for non-existent artist', async () => {
      const response = await request(app)
        .get('/artists/99999/discography')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Artist not found');
    });
  });

  describe('POST /artists/:id/discography', () => {
    let artist;

    beforeEach(async () => {
      artist = await testUtils.createTestArtist();
    });

    it('should add album to artist discography', async () => {
      const albumData = {
        title: 'New Album',
        year: 2023,
        tracks: ['Track 1', 'Track 2', 'Track 3']
      };

      const response = await request(app)
        .post(`/artists/${artist.id}/discography`)
        .send(albumData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Album added to discography');

      // Verify album was added
      const discographyResponse = await request(app)
        .get(`/artists/${artist.id}/discography`)
        .expect(200);

      expect(discographyResponse.body.discography).toHaveLength(1);
      expect(discographyResponse.body.discography[0].title).toBe(albumData.title);
    });

    it('should return 404 for non-existent artist', async () => {
      const albumData = {
        title: 'New Album',
        year: 2023,
        tracks: ['Track 1']
      };

      const response = await request(app)
        .post('/artists/99999/discography')
        .send(albumData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Artist not found');
    });

    it('should return error for missing required fields', async () => {
      const albumData = {
        year: 2023
        // Missing title
      };

      const response = await request(app)
        .post(`/artists/${artist.id}/discography`)
        .send(albumData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 