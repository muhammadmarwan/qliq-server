import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().nonempty('Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});