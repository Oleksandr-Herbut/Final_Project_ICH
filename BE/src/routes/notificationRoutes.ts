import {Router} from 'express';
import {param, body} from 'express-validator';
import { getNotification, createNotification, deleteNotification, updateNotificationStatus } from "../controllers/notificationController"; 
import { handleValidationErrors } from "../middlewares/validationMiddleware";
import { authenticateToken, refreshTokenMiddleware } from '../middlewares/authMiddleware';

const router : Router = Router();

// Получение уведомлений
router.get('/:userId/notifications', [
    param('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  getNotification);

// Получение уведомления по ID
router.get('/:notificationId', [
    param('notificationId').isString().notEmpty().withMessage('Notification ID is required'), // Проверка на пустое поле notificationId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  getNotification);

// Создание уведомления
router.post('/', [
    body('type').isString().notEmpty().withMessage('Notification type is required'), // Проверка на пустое поле type
    body('message').isString().notEmpty().withMessage('Notification message is required'), // Проверка на пустое поле text
    body('userId').isString().notEmpty().withMessage('User ID is required'), // Проверка на пустое поле userId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, createNotification);

// Удаление уведомления
router.delete('/:notificationId', [
    param('notificationId').isString().notEmpty().withMessage('Notification ID is required'), // Проверка на пустое поле notificationId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, deleteNotification);

// Обновление статуса уведомления
router.patch('/:notificationId', [
    param('notificationId').isString().notEmpty().withMessage('Notification ID is required'), // Проверка на пустое поле notificationId
    body('isRead').isBoolean().withMessage('Notification isRead must be a boolean'), // Указываем, что isRead должен быть булевым значением
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, updateNotificationStatus);

export default router;
