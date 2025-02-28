import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

// Генерация токена
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "3h" });
};

// Валидация токена
export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
