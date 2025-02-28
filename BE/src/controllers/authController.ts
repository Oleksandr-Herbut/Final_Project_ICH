import {Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import "dotenv/config";
import cloudinary from "cloudinary";




// Регистрация пользователя
export const register = async (req: Request, res: Response) => {
    const { username, email, password, full_name, profile_image } = req.body;

    try {
        // Проверяем, существует ли пользователь с таким email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Логика загрузки изображения
        let profileImageUrl = "";
        
        // Настройки загрузки изображения
        const tools = { 
            folder: 'user_profiles',
            resource_type: 'image',
            public_id: `${username}-profile`,
            overwrite: true,
        }

        // Если пользователь передал изображение
        if (profile_image) {
            // Загружаем изображение на Cloudinary
            const uploadResponse = await cloudinary.v2.uploader.upload(profile_image, {
                
                tools
                
            });
            profileImageUrl = uploadResponse.secure_url;
        } else {
            // Если изображение не передано, используем базовое изображение из Cloudinary
            const defaultImageUploadResponse = await cloudinary.v2.uploader.upload('https://res.cloudinary.com/da44utymt/image/upload/v1736806136/default_image_f0bbpm.png', {
                tools
            });
            profileImageUrl = defaultImageUploadResponse.secure_url;
        }

        // Создаем нового пользователя с изображением
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            full_name,
            profile_image: profileImageUrl, // Сохраняем URL изображения
        });

        // Сохраняем пользователя в базе данных
        await newUser.save();

        // Проверка наличия JWT_SECRET 
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        // Создаем JWT токен
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        // Отправляем ответ
        res.status(201).json({
            message: "User created successfully",
            token,
            user: newUser,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong, please try again later" });
    }
};
// Вход пользователя
export const login = async (req: Request, res: Response) : Promise<any>  => {
    const {email , password} = req.body;
    try {
        // Проверяем существует ли пользователь
        const user = await User.findOne({email});
        if (!user) {
             return res.status(400).json({message: "Invalid credentials"});
        }
        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
             return res.status(400).json({message: "Invalid password"});
        }
        // Создаем JWT токен
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: "1h"});
        res.status(200).json({message: "Login successful", token, user});
    } catch (err) {
        res.status(500).json({error: "Something went wrong, please try again later"});
    }
};

// Проверка пользователя
export const checkUser = async (req: Request, res: Response) : Promise<void> => {
    const { email } = req.body;
    try {
        // Проверяем существует ли пользователь
        const user = await User.findOne({ email });
        if (!user) {
             res.status(404).json({ message: "User not found" });
        }
        res.json({ message : "User exists" });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", errorMessage:(err as Error).message  });
    }
};

// Обновление пароля пользователя
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    const { email, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Ошибка обновления пароля:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: "Something went wrong, please try again later" });
        }
    }
};
