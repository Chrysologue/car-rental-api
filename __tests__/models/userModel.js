// tests/unit/models/userModel.test.js
const mongoose = require('mongoose');
const User = require('../../../models/userModel');

describe('User Model - GET Users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should return empty array when no users exist', async () => {
    const users = await User.find({});

    expect(users).toEqual([]);
    expect(users.length).toBe(0);
  });

  it('should return all users', async () => {
    await User.create([
      {
        googleId: '111',
        email: 'john@gmail.com',
        name: 'John Doe',
        role: 'user',
      },
      {
        googleId: '222',
        email: 'jane@gmail.com',
        name: 'Jane Smith',
        role: 'user',
      },
    ]);

    const users = await User.find({});

    expect(users.length).toBe(2);
    expect(users[0].email).toBe('john@gmail.com');
    expect(users[1].email).toBe('jane@gmail.com');
  });

  it('should find user by id', async () => {
    const newUser = await User.create({
      googleId: '333',
      email: 'bob@gmail.com',
      name: 'Bob Wilson',
      role: 'user',
    });

    // Get user by _id
    const foundUser = await User.findById(newUser._id);

    expect(foundUser).not.toBeNull();
    expect(foundUser.email).toBe('bob@gmail.com');
    expect(foundUser.name).toBe('Bob Wilson');
  });

  it('should return null when user id not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const user = await User.findById(fakeId);

    expect(user).toBeNull();
  });

  it('should find user by googleId', async () => {
    await User.create({
      googleId: '444',
      email: 'sarah@gmail.com',
      name: 'Sarah Lee',
      role: 'user',
    });

    const user = await User.findOne({ googleId: '444' });

    expect(user).not.toBeNull();
    expect(user.email).toBe('sarah@gmail.com');
    expect(user.name).toBe('Sarah Lee');
  });

  it('should return null when googleId not found', async () => {
    const user = await User.findOne({ googleId: 'not-exist' });

    expect(user).toBeNull();
  });

  it('should find user by email', async () => {
    await User.create({
      googleId: '555',
      email: 'mike@gmail.com',
      name: 'Mike Brown',
      role: 'user',
    });

    const user = await User.findOne({ email: 'mike@gmail.com' });

    expect(user).not.toBeNull();
    expect(user.googleId).toBe('555');
    expect(user.name).toBe('Mike Brown');
  });

  it('should return null when email not found', async () => {
    const user = await User.findOne({ email: 'notexist@gmail.com' });

    expect(user).toBeNull();
  });
});
