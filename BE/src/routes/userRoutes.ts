import { Router} from 'express';
import {param, body} from 'express-validator';
import { getUserProfile, updateUserProfile, getAllUsers, deleteAccount } from "../controllers/userController"; 
import { handleValidationErrors } from "../middlewares/validationMiddleware";
import { authenticateToken, refreshTokenMiddleware } from '../middlewares/authMiddleware';
import upload from '../utils/upload';


const router : Router = Router();

// Получение профиля пользователя
router.get('/:userId', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, getUserProfile);

// Обновление профиля пользователя
router.put('/current', upload.single('profile_image'),  [
    body('username').optional().isString().withMessage('Username must be a string'), // Проверка на строку username
    body("email").optional().isEmail().withMessage("Email is invalid"), // Проверка на валидный email
    body('bio').optional().isString().withMessage('Bio must be a string'), // Проверка на строку bio
    body('profile_image').optional().isString().withMessage('Profile image must be a string'), // Проверка на строку profileImage
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, updateUserProfile);

// Получение всех пользователей
router.get('/', getAllUsers);

// Удаление учётной записи пользователя
router.delete('/:userId', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, refreshTokenMiddleware, deleteAccount);

export default router;
