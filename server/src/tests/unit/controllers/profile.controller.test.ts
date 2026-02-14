import { Request, Response, NextFunction } from 'express';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { profileController } from '../../../controllers/profile.controller.js';
import { AuthRequest } from '../../../middleware/auth.middleware.js';

describe('Profile Controller', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      userId: 'test-user-id',
    };
    mockRes = {
      status: jest.fn().mockReturnThis() as unknown as Response['status'],
      json: jest.fn().mockReturnThis() as unknown as Response['json'],
    };
    mockNext = jest.fn();       
  });

  describe('create', () => {
    it('creates profile successfully', async () => {
      mockReq.body = {
        fullName: 'Test Farmer',
        state: 'Maharashtra',
        district: 'Pune',
        pincode: '411001',
        landholding: { totalArea: 5, ownershipType: 'owned' },
        cropTypes: ['wheat'],
        socialCategory: 'general',
      };

      await profileController.create(
        mockReq as AuthRequest,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});