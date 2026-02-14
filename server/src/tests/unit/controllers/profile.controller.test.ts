import { Request, Response } from 'express';
import { profileController } from '../../../controllers/profile.controller';
import { FarmerProfile } from '../../../models/index';

describe('Profile Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      userId: 'test-user-id',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('createProfile', () => {
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

      await profileController.createProfile(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Object),
        })
      );
    });
  });
});