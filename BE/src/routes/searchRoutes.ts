import { Router } from "express";
import { query } from "express-validator";
import { searchUsers, searchPosts } from "../controllers/searchController";
import { handleValidationErrors } from "../middlewares/validationMiddleware";

const router : Router = Router();

// Поиск пользователей
router.get("/users", [
    query('search').isString().notEmpty().withMessage('Search query is required'), // Проверка на пустое поле search
], handleValidationErrors, searchUsers);

// Поиск постов
router.get("/posts", [
    query('search').isString().notEmpty().withMessage('Search query is required'), // Проверка на пустое поле search
], handleValidationErrors, searchPosts);

export default router;
