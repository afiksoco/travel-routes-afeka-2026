import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;
  name: string;
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.ACCESS_SECRET!) as JwtPayload;
}
