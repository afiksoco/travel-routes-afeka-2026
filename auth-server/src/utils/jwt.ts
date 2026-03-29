import jwt from "jsonwebtoken";

interface TokenPayload {
  sub: string;
  name: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.ACCESS_SECRET!, { expiresIn: "1d" });
}

export function signRefreshToken(sub: string): string {
  return jwt.sign({ sub }, process.env.REFRESH_SECRET!, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.ACCESS_SECRET!) as TokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, process.env.REFRESH_SECRET!) as { sub: string };
}
