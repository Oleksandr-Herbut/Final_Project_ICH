import { Router } from "express";
import {body, param} from "express-validator";
import { getUserPosts,createPost, updatePost, getAllPosts, getPostById, deletePost,getFollowingPosts, getOtherProfilePosts } from "../controllers/postController";
import { handleValidationErrors } from "../middlewares/validationMiddleware";
import { authenticateToken, refreshTokenMiddleware } from "../middlewares/authMiddleware";
import upload from "../utils/upload";
const router : Router = Router();

// Создание поста
router.post('/create', upload.single('photo'), [
    body("content").isString().notEmpty().withMessage("Post content is required"), 
    body("userId").isString().notEmpty().withMessage("User ID is required")
], handleValidationErrors, authenticateToken, refreshTokenMiddleware,  createPost);


// Получение постов пользователя
router.get("/all", authenticateToken, refreshTokenMiddleware, getUserPosts);

// Получение всех постов
router.get("/all/public", authenticateToken, refreshTokenMiddleware, getAllPosts);

// Получение постов другого пользователя
router.get("/all/:userId", authenticateToken, refreshTokenMiddleware, getOtherProfilePosts);

// Получение поста по ID
router.get("/single/:postId", [
    param("postId").isString().notEmpty().withMessage("Post ID is required")
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, getPostById);

// Обновление поста
router.put("/:postId", [
    param("postId").isString().notEmpty().withMessage("Post ID is required"),
    body("content").isString().notEmpty().withMessage("Post content is required"), 
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, updatePost);

// Удаление поста
router.delete('/:postId', [
    param('postId').isString().notEmpty().withMessage("Post ID is required")
], handleValidationErrors, authenticateToken, refreshTokenMiddleware, deletePost);

// Получение постов подписанных пользователей
router.get("/followed", authenticateToken, refreshTokenMiddleware,  getFollowingPosts);


export default router;