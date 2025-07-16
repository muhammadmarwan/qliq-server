import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function registerUser(req: Request, res: Response) {
  try {
    console.log("first reached")
    const newUser = await authService.registerUser(req.body);
    
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const { token } = await authService.loginUser(email, password);
    res.json({ token });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Login failed' });
  }
}

export async function registerAdmin(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const admin = await authService.registerAdmin(name, email, password);
    res.status(201).json({ message: 'Admin created successfully', id: admin._id });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { token, admin } = await authService.loginAdmin(email, password);

    res.json({ token, admin });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}
