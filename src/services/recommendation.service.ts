import { OpenAI } from 'openai';
import Order from '../models/Order';
import Product from '../models/Product';
import { config } from '../utils/config';

const openai = new OpenAI({
  apiKey: config.openAIKey,
});

interface Product {
  name: string;
  description: string;
  price: number;
}

export async function generateProductRecommendations(
  purchases: Product[],
  catalog: Product[]
): Promise<string[]> {
  const prompt = `
You are a smart eCommerce assistant.

The user has purchased these products:
${purchases.map(p => `- ${p.name} (${p.price}$): ${p.description}`).join('\n')}

Here is the product catalog:
${catalog.map(p => `- ${p.name} (${p.price}$): ${p.description}`).join('\n')}

Based on the user's purchases, recommend 3 new products they might like from the catalog.
Return only the product names in a JSON array.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message?.content;
    if (!response) return [];

    // Parse the JSON response (should be an array of product names)
    const recommendedNames = JSON.parse(response);
    if (Array.isArray(recommendedNames)) {
      return recommendedNames;
    }
    return [];
  } catch (error) {
    console.error('OpenAI recommendation error:', error);
    return [];
  }
}


export async function getSmartRecommendations(userId: string) {
  const orders = await Order.find({ user: userId }).populate('items.product');
  
const purchasedProducts = orders.flatMap(order =>
  order.items.map(item => {
    const product = item.product as any;
    return {
      name: product.name,
      description: product.description || '',
      price: product.price,
    };
  })
);

  const fullCatalog = await Product.find();

  const aiRecommendedNames = await generateProductRecommendations(
    purchasedProducts,
    fullCatalog.map(p => ({
      name: p.name,
      description: p.description || '',
      price: p.price,
    }))
  );

  // Find products in catalog matching AI recommendations
  const recommendedProducts = await Product.find({
    name: { $in: aiRecommendedNames },
  });

  return recommendedProducts;
}