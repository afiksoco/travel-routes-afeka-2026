import { Request, Response } from "express";
import { z } from "zod/v4";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const { email, name, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, name, passwordHash });

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    name: user.name,
  });
  const refreshToken = signRefreshToken(user._id.toString());

  // Store hashed refresh token
  user.refreshToken = await hashPassword(refreshToken);
  await user.save();

  res.status(201).json({ accessToken, refreshToken, name: user.name });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    name: user.name,
  });
  const refreshToken = signRefreshToken(user._id.toString());

  user.refreshToken = await hashPassword(refreshToken);
  await user.save();

  res.json({ accessToken, refreshToken, name: user.name });
}

export async function refresh(req: Request, res: Response) {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const { refreshToken } = parsed.data;

  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.refreshToken) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  const valid = await comparePassword(refreshToken, user.refreshToken);
  if (!valid) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  // Rotate tokens
  const newAccessToken = signAccessToken({
    sub: user._id.toString(),
    name: user.name,
  });
  const newRefreshToken = signRefreshToken(user._id.toString());

  user.refreshToken = await hashPassword(newRefreshToken);
  await user.save();

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    name: user.name,
  });
}
