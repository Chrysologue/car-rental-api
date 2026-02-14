const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/userModel');
const { generateToken, mockOAuthUser } = require('../setup');

describe('User Routes - GET endpoints with OAuth', () => {
  let userToken;
  let adminToken;
  let testUser;
  let adminUser;
  let userId;
  let adminId;

  beforeEach(async () => {
    // Create regular OAuth user
    const regularOAuthUser = mockOAuthUser({
      id: 'google-user-456',
      emails: [{ value: 'regular.user@example.com' }],
      displayName: 'Regular User',
    });

    testUser = await User.create({
      oauthId: regularOAuthUser.id,
      email: regularOAuthUser.emails[0].value,
      name: regularOAuthUser.displayName,
      avatar: regularOAuthUser.photos[0].value,
      provider: regularOAuthUser.provider,
      role: 'user',
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
    });
    userId = testUser._id;
    userToken = generateToken(userId, 'user');

    // Create admin OAuth user
    const adminOAuthUser = mockOAuthUser({
      id: 'google-admin-789',
      emails: [{ value: 'admin.user@example.com' }],
      displayName: 'Admin User',
    });

    adminUser = await User.create({
      oauthId: adminOAuthUser.id,
      email: adminOAuthUser.emails[0].value,
      name: adminOAuthUser.displayName,
      avatar: adminOAuthUser.photos[0].value,
      provider: adminOAuthUser.provider,
      role: 'admin',
      phone: '+1987654321',
    });
    adminId = adminUser._id;
    adminToken = generateToken(adminId, 'admin');

    // Create additional test users
    await User.create({
      oauthId: 'google-user-111',
      email: 'user1@example.com',
      name: 'Test User 1',
      provider: 'google',
      role: 'user',
    });

    await User.create({
      oauthId: 'google-user-222',
      email: 'user2@example.com',
      name: 'Test User 2',
      provider: 'google',
      role: 'user',
    });
  });

  describe('GET /api/users', () => {
    it('should return all users for admin only', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3); // admin + 2 regular users
    });

    it('should return 403 for regular user trying to access all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/admin|unauthorized/i);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/users').expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should allow user to access their own profile', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(userId.toString());
      expect(response.body.data.email).toBe('regular.user@example.com');
      expect(response.body.data.name).toBe('Regular User');
    });

    it('should allow admin to access any user profile', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(userId.toString());
    });

    it("should return 403 when user tries to access another user's profile", async () => {
      const otherUserId = (await User.findOne({ email: 'user1@example.com' }))
        ._id;

      const response = await request(app)
        .get(`/api/users/${otherUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/unauthorized|permission/i);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return OAuth provider info in user profile', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.provider).toBe('google');
      expect(response.body.data.oauthId).toBeDefined();
      expect(response.body.data.avatar).toBeDefined();
    });
  });

  describe('GET /api/users/me', () => {
    it('should return current authenticated user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(userId.toString());
      expect(response.body.data.email).toBe('regular.user@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/users/me').expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should include OAuth details in profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.provider).toBe('google');
      expect(response.body.data.avatar).toBeDefined();
    });
  });

  describe('GET /api/users/oauth/:provider', () => {
    it('should return users by OAuth provider', async () => {
      const response = await request(app)
        .get('/api/users/oauth/google')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(
        response.body.data.every((user) => user.provider === 'google'),
      ).toBe(true);
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/users/oauth/google')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
