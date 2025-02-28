import {Router} from 'express';
import {body, param} from 'express-validator';
import { getFollowers, getFollowing, followUser, unfollowUser, checkIfFollowing } from "../controllers/followController"; 
import { handleValidationErrors } from "../middlewares/validationMiddleware";
import { authenticateToken } from '../middlewares/authMiddleware';
import { refreshTokenMiddleware } from '../middlewares/authMiddleware';

const router : Router = Router();

// Получение подписчиков
router.get('/followers/:userId', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  getFollowers);

// Получение подписок
router.get('/following/:userId', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  getFollowing);

// Подписка на пользователя
router.post('/:userId/follow/:targetUserId', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
    param('targetUserId').isString().notEmpty().withMessage('Target User ID is required'), // Проверка на пустое поле targetUserId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, followUser);

// Отписка от пользователя
router.delete('/:userId/unfollow/:targetUserId', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
    param('targetUserId').isString().notEmpty().withMessage('Target User ID is required'), // Проверка на пустое поле targetUserId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, unfollowUser);

//Проверка наличия подписки на пользователя
router.get("/:userId/isFollowing/:targetUserId", [
    param('userId').isString().notEmpty().withMessage("User ID is required"),
    param('targetUserId').isString().notEmpty().withMessage('Target User ID is required'),
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, checkIfFollowing );


export default router;
