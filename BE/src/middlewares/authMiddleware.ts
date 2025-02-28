import { Request, Response, NextFunction } from "express";


// Расширяем интерфейс Request
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}
import jwt, { JwtPayload } from "jsonwebtoken";
import WebSocket from "ws";
import 'dotenv/config';
import {generateToken, verifyToken} from "../db/jwt";


// Middleware для аутентификации WebSocket соединений
export const authenticateSocket = (_ws: WebSocket, req: Request, next: (err?: any) => void) => {
  const token = req.cookies?.token as string; // Получаем токен из куки
  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    (req as any).user = decoded; // Сохраняем пользователя в запросе для дальнейшего использования
    next();
  });
};

// Middleware для аутентификации HTTP запросов
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as JwtPayload;
    req.user = decoded; // Сохраняем данные пользователя в `req.user` для использования в маршрутах
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired" });
    
    
  }
};

//Middleware для обновления токена
export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) : any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
      const decoded = verifyToken(token) as JwtPayload;

      // Проверяем оставшееся время действия токена
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp ? decoded.exp - currentTime : 0;

      if (timeLeft < 5 * 60) { // Если осталось меньше 5 минут
          const newToken = generateToken({ id: decoded.id }); // Создаем новый токен
          res.setHeader("Authorization", `Bearer ${newToken}`);
      }

      req.user = decoded; // Сохраняем данные пользователя в запросе
      next();
  } catch (error) {
      return res.status(403).json({ message: "Token is invalid or expired" });
  }
};




// // Миддлвар для аутентификации HTTP запросов (Оставляем без изменений)
// export const authenticateRequest = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     (req as any).user = decoded;
//     next();
//   });
// };

