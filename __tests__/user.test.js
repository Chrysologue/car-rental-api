// Mock middlewares
jest.mock('../middleware/authMiddleware', () => ({
  verifyUser: (req, res, next) => {
    req.user = { role: 'admin' }; // fake admin
    next();
  },
}));

jest.mock('../middleware/adminMiddleware', () => ({
  checkAdmin: (req, res, next) => next(),
}));

// Mock User model
jest.mock("../models/userModel", () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

const request = require("supertest");
const express = require("express");
const userRoute = require("../routes/userRoutes");
const User = require("../models/userModel");

const app = express();
app.use(express.json());
app.use('/api', userRoute);

describe("User GET routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/users returns all users", async () => {
    User.find.mockResolvedValue([
      { _id: '507f1f77bcf86cd799439033', name: 'Alice', email: 'alice@test.com', role: 'user' }
    ]);

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('name', 'Alice');
  });

  test("GET /api/users/:id returns a single user", async () => {
    const fakeId = '507f1f77bcf86cd799439033';
    User.findById.mockResolvedValue({
      _id: fakeId,
      name: 'Charlie',
      email: 'charlie@test.com',
      role: 'user',
    });

    const res = await request(app).get(`/api/users/${fakeId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Charlie');
  });
});
