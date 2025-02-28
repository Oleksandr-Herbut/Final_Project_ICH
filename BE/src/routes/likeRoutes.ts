import { Router } from "express";
import {param} from "express-validator";
import { getLikePost, likePost, deleteLike, getLikeUser } from "../controllers/likeController";
import { handleValidationErrors } from "../middlewares/validationMiddleware";
import { refreshTokenMiddleware, authenticateToken } from "../middlewares/authMiddleware";


const router : Router = Router();

// Получение лайков поста
router.get('/:postId/likes', [
    param('postId').isString().notEmpty().withMessage('Post ID is required'), // Проверка на пустое поле postId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  getLikePost);

// Лайк поста
router.post('/:postId/:userId', [
    param('postId').isString().notEmpty().withMessage('Post ID is required'), // Проверка на пустое поле postId
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, likePost);

// Удаление лайка поста
router.delete('/:postId/:userId', [
    param('postId').isString().notEmpty().withMessage('Post ID is required'), // Проверка на пустое поле postId
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, deleteLike);

// Получение лайков всех пользователей
router.get('/user/:userId', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, getLikeUser);

export default router;