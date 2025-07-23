import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  openAIKey: process.env.OPENAI_API_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || '',
};
