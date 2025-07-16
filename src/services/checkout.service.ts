import axios from 'axios';
import Cart from '../models/Cart';
import Order from '../models/Order';
import User from '../models/User';

export async function checkout(userId: string, token: string) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
    }

    let total = 0;
    const orderItems = cart.items.map((item) => {
        const price = (item.product as any).price;
        total += price * item.quantity;
        return {
            product: item.product._id,
            quantity: item.quantity,
            price,
        };
    });

    // Mock payment
    const PAYMENT_MOCK_API = process.env.PAYMENT_MOCK_API as string;
    const paymentResponse = await axios.post(
        PAYMENT_MOCK_API!,
        {
            amount: total,
            method: 'card',
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const success = paymentResponse.data.success;
    const transactionId = paymentResponse.data.transactionId || 'N/A';

    const order = await Order.create({
        user: userId,
        items: orderItems,
        total,
        transactionId,
        paymentStatus: success ? 'paid' : 'failed',
    });

    if (success) {
        await Cart.findOneAndDelete({ user: userId });

        const user = await User.findById(userId);
        const commissionPerLevel = [0.1, 0.05, 0.02];

        let currentRef = user?.referrer;
        for (let level = 0; level < 3 && currentRef; level++) {
            const commission = total * commissionPerLevel[level];
            await User.findByIdAndUpdate(currentRef, {
                $inc: { commissionBalance: commission },
            });

            const refUser = await User.findById(currentRef);
            currentRef = refUser?.referrer;
        }
    }

    return order;
}
