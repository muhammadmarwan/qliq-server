import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from './config';

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = '1d'; 

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') return null;
    return decoded;
  } catch {
    return null;
  }
}
