import {
  registerUser,
  loginUser,
  registerAdmin,
  loginAdmin
} from '../../controllers/auth.controller';
import { Request, Response } from 'express';
import * as authService from '../../services/auth.service';

describe('Auth Controller', () => {
  let mockRequest = {} as Request;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson })) as any;
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register user and return 201', async () => {
      const mockUser: any = { _id: 'user123' };
      jest.spyOn(authService, 'registerUser').mockResolvedValue(mockUser);

      mockRequest = { body: { email: 'test@mail.com', password: '123456' } } as Request;
      await registerUser(mockRequest, mockResponse as Response);

      expect(authService.registerUser).toHaveBeenCalledWith(mockRequest.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'User registered successfully',
        userId: mockUser._id
      });
    });

    it('should return 400 on error', async () => {
      jest.spyOn(authService, 'registerUser').mockRejectedValue(new Error('Failed'));

      mockRequest = { body: {} } as Request;
      await registerUser(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Failed' });
    });
  });

  describe('loginUser', () => {
    it('should login and return token', async () => {
      jest.spyOn(authService, 'loginUser').mockResolvedValue({ token: 'abc123' });

      mockRequest = { body: { email: 'test@mail.com', password: 'pass' } } as Request;
      await loginUser(mockRequest, mockResponse as Response);

      expect(authService.loginUser).toHaveBeenCalledWith('test@mail.com', 'pass');
      expect(mockJson).toHaveBeenCalledWith({ token: 'abc123' });
    });

    it('should return 400 if email or password missing', async () => {
      mockRequest = { body: { email: '' } } as Request;
      await loginUser(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Email and password required' });
    });

    it('should return 400 on login error', async () => {
      jest.spyOn(authService, 'loginUser').mockRejectedValue(new Error('Invalid credentials'));

      mockRequest = { body: { email: 'test@mail.com', password: 'wrong' } } as Request;
      await loginUser(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('registerAdmin', () => {
    it('should create admin and return 201', async () => {
      const admin: any = { _id: 'admin123' };
      jest.spyOn(authService, 'registerAdmin').mockResolvedValue(admin);

      mockRequest = { body: { name: 'Admin', email: 'admin@mail.com', password: 'admin123' } } as Request;
      await registerAdmin(mockRequest, mockResponse as Response);

      expect(authService.registerAdmin).toHaveBeenCalledWith('Admin', 'admin@mail.com', 'admin123');
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Admin created successfully', id: admin._id });
    });

    it('should return 400 on error', async () => {
      jest.spyOn(authService, 'registerAdmin').mockRejectedValue(new Error('Create failed'));

      mockRequest = { body: {} } as Request;
      await registerAdmin(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Create failed' });
    });
  });

  describe('loginAdmin', () => {
    it('should login admin and return token and admin object', async () => {
      const result: any = {
        token: 'admin-token',
        admin: { _id: 'admin1', name: 'Admin' }
      };

      jest.spyOn(authService, 'loginAdmin').mockResolvedValue(result);

      mockRequest = { body: { email: 'admin@mail.com', password: 'admin123' } } as Request;
      await loginAdmin(mockRequest, mockResponse as Response);

      expect(authService.loginAdmin).toHaveBeenCalledWith('admin@mail.com', 'admin123');
      expect(mockJson).toHaveBeenCalledWith(result);
    });

    it('should return 401 on login error', async () => {
      jest.spyOn(authService, 'loginAdmin').mockRejectedValue(new Error('Unauthorized'));

      mockRequest = { body: { email: 'admin@mail.com', password: 'wrong' } } as Request;
      await loginAdmin(mockRequest, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });
});
