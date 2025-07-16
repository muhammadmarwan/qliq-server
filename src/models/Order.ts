import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  transactionId: string;
  paymentStatus: 'paid' | 'failed';
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['paid', 'failed'],
      required: true,
      default: 'paid',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
