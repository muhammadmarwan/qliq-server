import Admin, { IAdmin } from '../models/Admin';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { signJwt } from '../utils/jwt';
import { getIO } from '../socket';

function generateReferralCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  referalCode?: string;
}): Promise<IUser> {
  const { name, email, password, referalCode } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);

  let referrer: IUser | null = null;
  let level = 0;

  if (referalCode) {

    referrer = await User.findOne({ referralCode: `${referalCode}` });
    
    if (!referrer) throw new Error("Referrer Code not found");

    level = Math.min(referrer.level + 1, 3);
  }

  let newReferralCode = generateReferralCode();

  while (await User.findOne({ referralCode: newReferralCode })) {
    newReferralCode = generateReferralCode();
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    referralCode: newReferralCode,
    referrer: referrer ? referrer._id : null,
    level,
    downlines: [],
  });

  await newUser.save();

  if (referrer && referrer.downlines.length < 3) {
    referrer.downlines.push(newUser._id as Types.ObjectId);
    await referrer.save();
  }

  // Commission distribution
  const commissionRates = [0.1, 0.05, 0.02];
  let currentReferrerId = referrer?._id || null;

  for (let i = 0; i < 3 && currentReferrerId; i++) {
    const uplineUser = await User.findById(currentReferrerId);
    if (!uplineUser) break;

    const commissionAmount = 100 * commissionRates[i];
    uplineUser.commissionBalance = (uplineUser.commissionBalance || 0) + commissionAmount;

    await uplineUser.save();

    currentReferrerId = uplineUser.referrer as Types.ObjectId | null;
  }

  // Emit update to socket
  try {
    const io = getIO();
    io.emit('userTreeUpdated');
  } catch (error) {
    console.warn('Socket emit failed', error);
  }

  return newUser;
}


export async function loginUser(email: string, password: string): Promise<{ token: string }> {
  const user = await User.findOne({ email }) as IUser | null;
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = signJwt({ id: user._id, email: user.email, role: 'user' });
  return { token };
}

export async function registerAdmin(name: string, email: string, password: string): Promise<IAdmin> {
  const existing = await Admin.findOne({ email });
  if (existing) throw new Error('Admin already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ name, email, password: hashedPassword }) as IAdmin;

  return admin;
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string; admin: IAdmin }> {
  const admin = await Admin.findOne({ email }) as IAdmin | null;
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = signJwt({ id: admin._id, role: 'admin' });

  return {
    token,
    admin,
  };
}
