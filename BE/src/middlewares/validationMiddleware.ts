import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Обработка ошибок валидации
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) : void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    next();
};

