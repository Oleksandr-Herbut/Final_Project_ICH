import { Router } from 'express';
import { body, param } from 'express-validator';
import { createComment, getComments, deleteComment, likeComment } from "../controllers/commentController"; 
import { handleValidationErrors } from "../middlewares/validationMiddleware";
import { authenticateToken } from '../middlewares/authMiddleware';
import { refreshTokenMiddleware } from '../middlewares/authMiddleware';


const router : Router = Router();

// Добавление комментария
router.post('/:postId', [
    param('postId').isString().notEmpty().withMessage('Post ID is required'), // Проверка на пустое поле postId
    body('content').isString().notEmpty().withMessage('Comment text is required'), // Проверка на пустое поле text
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, createComment);

// Получение комментариев с пагинацией 
router.get("/:postId", authenticateToken, refreshTokenMiddleware,  getComments);

//Удаление комментария
router.delete('/:commentId', [
    param('commentId').isString().notEmpty().withMessage('Comment ID is required'), // Проверка на пустое поле commentId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  deleteComment);

//Лайк комментария
router.post('/like/:commentId', [
    param('commentId').isString().notEmpty().withMessage('Comment ID is required'), // Проверка на пустое поле commentId
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  likeComment);

export default router;