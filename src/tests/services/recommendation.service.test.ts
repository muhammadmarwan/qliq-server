// src/tests/services/recommendation.service.test.ts
import { OpenAI } from 'openai';
import * as recommendationService from '../../services/recommendation.service';
import Order from '../../models/Order';
import Product from '../../models/Product';

// Mock OpenAI with a shared create mock function
jest.mock('openai', () => {
  const createMock = jest.fn();

  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: createMock,
        },
      },
      // expose createMock so tests can access it
      __createMock: createMock,
    })),
  };
});

jest.mock('../../models/Order');
jest.mock('../../models/Product');

describe('recommendation service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateProductRecommendations', () => {
    it('should return parsed recommended product names from OpenAI', async () => {
      const openaiInstance = new OpenAI();
      const mockCreate = (openaiInstance as any).__createMock as jest.Mock;

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: '["Product C", "Product D", "Product E"]',
            },
          },
        ],
      });

      const purchases = [
        { name: 'Product A', description: 'Desc A', price: 10 },
      ];
      const catalog = [
        { name: 'Product B', description: 'Desc B', price: 20 },
      ];

      const recommended = await recommendationService.generateProductRecommendations(purchases, catalog);

      expect(Array.isArray(recommended)).toBe(true);
      expect(recommended).toEqual(['Product C', 'Product D', 'Product E']);
    });

    it('should return empty array on OpenAI error', async () => {
      const openaiInstance = new OpenAI();
      const mockCreate = (openaiInstance as any).__createMock as jest.Mock;

      mockCreate.mockRejectedValue(new Error('Failed'));

      // Silence console.error to keep test output clean
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

      const recommended = await recommendationService.generateProductRecommendations([], []);
      expect(recommended).toEqual([]);

      consoleErrorMock.mockRestore();
    });
  });

  describe('getSmartRecommendations', () => {
    it('should return recommended product docs', async () => {
      const userId = 'user123';

      const mockOrders = [
        {
          items: [
            {
              product: { name: 'Prod1', description: 'Desc1', price: 10, _id: 'p1' },
              quantity: 1,
            },
          ],
        },
      ];

      const mockFullCatalog = [
        { name: 'Prod1', description: 'Desc1', price: 10 },
        { name: 'Prod2', description: 'Desc2', price: 20 },
        { name: 'Prod3', description: 'Desc3', price: 30 },
        { name: 'Prod4', description: 'Desc4', price: 40 },
      ];

      const mockRecommendedNames = ['Prod3', 'Prod4'];

      // Mock Order.find().populate()
      (Order.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrders),
      });

      // Mock Product.find() twice: first full catalog, then filtered recommended
      (Product.find as jest.Mock)
        .mockResolvedValueOnce(mockFullCatalog) // full catalog
        .mockResolvedValueOnce(
          mockFullCatalog.filter(p => mockRecommendedNames.includes(p.name))
        ); // filtered recommended

      const openaiInstance = new OpenAI();
      const mockCreate = (openaiInstance as any).__createMock as jest.Mock;

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockRecommendedNames),
            },
          },
        ],
      });

      const results = await recommendationService.getSmartRecommendations(userId);

      expect(Order.find).toHaveBeenCalledWith({ user: userId });
      expect(Product.find).toHaveBeenCalledTimes(2);
      expect(results).toEqual(
        mockFullCatalog.filter(p => mockRecommendedNames.includes(p.name))
      );
    });
  });
});
