// Test suite for userController
const { registerUser } = require('./userController');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Mock User model
jest.mock('../models/user');
// Mock bcrypt
jest.mock('bcrypt');

describe('registerUser', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Reset mocks for User and bcrypt before each test
    User.findOne.mockReset();
    User.create.mockReset();
    bcrypt.genSalt.mockReset();
    bcrypt.hash.mockReset();
  });

  test('should return 400 if password is too short', async () => {
    mockReq.body = { username: 'testuser', email: 'test@example.com', password: 'Short1' };
    await registerUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Password must be at least 8 characters long.' });
  });

  test('should return 400 if password does not contain an uppercase letter', async () => {
    mockReq.body = { username: 'testuser', email: 'test@example.com', password: 'nouppercase' };
    await registerUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Password must contain at least one uppercase letter.' });
  });

  test('should return 400 if password is missing', async () => {
    mockReq.body = { username: 'testuser', email: 'test@example.com' }; // No password
    await registerUser(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Password is required.' });
  });

  test('should register user successfully with a valid password', async () => {
    mockReq.body = { username: 'testuser', email: 'test@example.com', password: 'ValidPass1' };

    // Mock User.findOne to simulate user not existing
    User.findOne.mockResolvedValue(null);

    // Mock bcrypt functions
    bcrypt.genSalt.mockResolvedValue('somesalt');
    bcrypt.hash.mockResolvedValue('hashedPassword');

    // Mock User.create to simulate successful user creation
    const createdUser = { _id: 'someid', username: 'testuser', email: 'test@example.com' };
    User.create.mockResolvedValue(createdUser);

    await registerUser(mockReq, mockRes);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('ValidPass1', 'somesalt');
    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      _id: 'someid',
      username: 'testuser',
      email: 'test@example.com',
    });
  });
});
