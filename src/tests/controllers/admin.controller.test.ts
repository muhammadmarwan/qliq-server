import { getDashoardStats } from "../../controllers/admin.controller";
import * as adminService from "../../services/admin.service";

describe('Admin Controller - getDashboardStats', () => {
  const mockRequest = {} as any;

  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: any;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    jest.clearAllMocks();
  });

  it('should return dashboard stats on success', async () => {
    const fakeStats: any = {
      totalUsers: 100,
      totalOrders: 200,
      totalRevenue: 5000,
    };

    jest.spyOn(adminService, 'getAdminDashboardStats').mockResolvedValue(fakeStats);

    await getDashoardStats(mockRequest, mockResponse);

    expect(adminService.getAdminDashboardStats).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(fakeStats);
  });

  it('should return error response on failure', async () => {
    const fakeError = new Error('Something went wrong');

    jest.spyOn(adminService, 'getAdminDashboardStats').mockRejectedValue(fakeError);

    await getDashoardStats(mockRequest, mockResponse);

    expect(adminService.getAdminDashboardStats).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Something went wrong' });
  });
});
