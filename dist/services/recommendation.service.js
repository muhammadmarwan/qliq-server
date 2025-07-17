"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductRecommendations = generateProductRecommendations;
exports.getSmartRecommendations = getSmartRecommendations;
const openai_1 = require("openai");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const config_1 = require("../utils/config");
const openai = new openai_1.OpenAI({
    apiKey: config_1.config.openAIKey,
});
async function generateProductRecommendations(purchases, catalog) {
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
        if (!response)
            return [];
        // Parse the JSON response (should be an array of product names)
        const recommendedNames = JSON.parse(response);
        if (Array.isArray(recommendedNames)) {
            return recommendedNames;
        }
        return [];
    }
    catch (error) {
        console.error('OpenAI recommendation error:', error);
        return [];
    }
}
async function getSmartRecommendations(userId) {
    const orders = await Order_1.default.find({ user: userId }).populate('items.product');
    const purchasedProducts = orders.flatMap(order => order.items.map(item => {
        const product = item.product;
        return {
            name: product.name,
            description: product.description || '',
            price: product.price,
        };
    }));
    const fullCatalog = await Product_1.default.find();
    const aiRecommendedNames = await generateProductRecommendations(purchasedProducts, fullCatalog.map(p => ({
        name: p.name,
        description: p.description || '',
        price: p.price,
    })));
    // Find products in catalog matching AI recommendations
    const recommendedProducts = await Product_1.default.find({
        name: { $in: aiRecommendedNames },
    });
    return recommendedProducts;
}
