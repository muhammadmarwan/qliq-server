import * as authService from '../../services/auth.service';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../utils/jwt';

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('../../utils/jwt');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register user without referrer', async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce(null); // email check
      (User.findOne as jest.Mock).mockResolvedValueOnce(null); // referralCode unique

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');

      const newUserSaveMock = jest.fn().mockResolvedValue(true);
      (User as any).mockImplementation(() => ({
        save: newUserSaveMock,
        _id: 'newid',
      }));

      const result = await authService.registerUser({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(User.findOne).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(newUserSaveMock).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should register user with valid referrer and distribute commission', async () => {
      const referrer = {
        _id: 'referrerid',
        level: 1,
        downlines: [],
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock)
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce(referrer) // referrer found
        .mockResolvedValueOnce(null); // referralCode unique

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpass');

      const newUserSaveMock = jest.fn().mockResolvedValue(true);
      (User as any).mockImplementation(() => ({
        save: newUserSaveMock,
        _id: 'newid',
      }));

      (User.findById as jest.Mock)
        .mockResolvedValueOnce(referrer) // 1st upline
        .mockResolvedValueOnce(null); // 2nd upline

      const result = await authService.registerUser({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123',
        referalCode: 'ABC123',
      });

      expect(User.findOne).toHaveBeenCalledTimes(3);
      expect(referrer.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('loginUser', () => {
    it('should login user and return token', async () => {
      const user = {
        _id: 'userid',
        email: 'test@example.com',
        password: 'hashedpass',
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (signJwt as jest.Mock).mockReturnValue('jwt-token');

      const result = await authService.loginUser('test@example.com', 'password');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpass');
      expect(signJwt).toHaveBeenCalledWith({ id: 'userid', email: 'test@example.com', role: 'user' });
      expect(result).toEqual({ token: 'jwt-token' });
    });

    it('should throw error for invalid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUser('wrong@example.com', 'password'))
        .rejects
        .toThrow('Invalid email or password');
    });

    it('should throw error for wrong password', async () => {
      const user = {
        _id: 'userid',
        email: 'test@example.com',
        password: 'hashedpass',
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.loginUser('test@example.com', 'wrongpass'))
        .rejects
        .toThrow('Invalid email or password');
    });
  });
});
