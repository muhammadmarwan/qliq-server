import Cart, { ICart } from '../models/Cart';
import mongoose from 'mongoose';

export async function getCartByUser(userId: string) {
  return Cart.findOne({ user: userId })
    .populate('items.product', 'name price image')
    .lean();
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const cart = await Cart.findOne({ user: userId });

  const productObjectId = new mongoose.Types.ObjectId(productId);

  if (!cart) {
    const newCart = await Cart.create({
      user: userId,
      items: [{ product: productObjectId, quantity }],
    });
    return newCart;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productObjectId.toString()
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productObjectId, quantity });
  }

  await cart.save();
  return cart;
}

export async function removeFromCart(userId: string, cartItemId: string): Promise<ICart | null> {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cartItemObjectId = new mongoose.Types.ObjectId(cartItemId);

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userObjectId },
      { $pull: { items: { _id: cartItemObjectId } } },
      { new: true }
    ).populate('items.product', 'name price');

    if (!updatedCart) {
      throw new Error('Cart not found or item already removed');
    }

    return updatedCart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}
