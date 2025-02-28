import { Request, Response, NextFunction } from "express";

// Миддлвар для глобальной обработки ошибок
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong, please try again later" });
};
