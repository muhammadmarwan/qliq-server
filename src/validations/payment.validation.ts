import z from "zod";

export const mockPaymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['card', 'wallet', 'upi']),
});