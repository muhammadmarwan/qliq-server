import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';
import Product from '../models/Product';

export async function getCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const cart = await cartService.getCartByUser(userId);
    res.json(cart || { items: [] });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to get cart' });
  }
}

export async function addToCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    // Check if product exists
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }


    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to add to cart' });
  }
}

export async function removeFromCart(req: Request, res: Response) {
  try {

    console.log(req.params)
    const userId = (req as any).user.id;
    const { productId } = req.params;

    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const updatedCart = await cartService.removeFromCart(userId, productId);
    res.json(updatedCart);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to remove item from cart' });
  }
}

