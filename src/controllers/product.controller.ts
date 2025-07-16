import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import * as recommendationService from '../services/recommendation.service'

export async function getPaginatedProducts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { products, total } = await productService.getPaginatedProducts(page, limit);

    res.json({ data: products, total });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch products' });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const products = await productService.getProducts(userId);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch products' });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const product = await productService.createProduct({ name, description, price, image });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create product' });
  }
}

export async function updateProducts(req: Request, res: Response) {
  try {
    const { productId } = req.params;

    const updatedProducts = await productService.updateProducts(productId, req.body);
    res.json(updatedProducts);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update products' });
  }
}

export async function getAIRecommendations(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const products = await recommendationService.getSmartRecommendations(userId);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to get recommendations' });
  }
}