import  { Router } from 'express';
import {body} from 'express-validator';
import { register, login, checkUser, updatePassword } from "../controllers/authController"; 
import { handleValidationErrors } from "../middlewares/validationMiddleware";
// import { authenticateToken } from "../middlewares/authMiddleware";


const router : Router = Router();


router.post('/login', [
    body("email").isEmail().withMessage("Invalid email address"), // Проверка на валидность email
    body("password").isString().notEmpty().withMessage("Password is required") // Проверка на пустое поле password
], handleValidationErrors, login);

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format'), // Проверка на валидность email
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'), // Проверка на длину пароля
    body('username').notEmpty().withMessage('Username is required'), // Проверка на пустое поле username
], handleValidationErrors, register)

router.post('/check-user', [
    body('email').isEmail().withMessage('Invalid email address'), // Проверка на валидность email
], handleValidationErrors, checkUser, );

router.post('/update-password', [
    body('email').isEmail().withMessage('Invalid email address'), // Проверка на валидность email
    body('newPassword').isLength({min: 6}).withMessage('Password must be at least 6 characters long'), // Проверка на длину пароля
], handleValidationErrors, updatePassword);




export default router;