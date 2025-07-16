import mongoose, { Types } from 'mongoose';
import Cart from '../models/Cart';
import Product, { IProduct } from '../models/Product';

export async function getPaginatedProducts(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments()
  ]);

  return { products, total };
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  image?: string;
}) {
  const product = new Product(data);
  return await product.save();
}

export async function getProducts(userId: string) {
  const [products, cart] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).lean(),
    Cart.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean()
  ]);

  const cartMap = new Map<string, number>();
  if (cart && cart.items) {
    cart.items.forEach(item => {
      cartMap.set(item.product.toString(), item.quantity);
    });
  }

  const getProducts = products.map(product => ({
    ...product,
    cart: cartMap.get(product._id.toString()) || 0
  }));

  return getProducts;
}

export async function updateProducts(productId: string, products: any) {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const productIds = product._id;

  const updatedProducts = await Product.updateMany(
    { _id: { $in: productIds } },
    {
      $set: {
        name: products.name,
        description: products.description,
        price: products.price,
        image: products.image,
      },
    }
  );

  return updatedProducts;
}