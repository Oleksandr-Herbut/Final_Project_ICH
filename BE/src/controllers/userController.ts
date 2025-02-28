import {Request, Response} from "express";
import User from "../models/User";
import multer from "multer";
import mongoose from "mongoose";
// import { validationResult } from "express-validator";
import stream from "stream";
import { v2 as cloudinary } from 'cloudinary';
import getUserIdFromToken from "../utils/helps";




//Получение профиля пользователя
export const getUserProfile = async (req: Request, res: Response) : Promise<void> => {
    const { userId } = req.params;
    try{
        const user = await User.findById(userId).populate("posts").populate("followers").populate("followings");
        if (!user) {
             res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
}

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage(); // Хранить файл в памяти
const upload = multer({ storage }).single('profile_image'); // 'profile_image' - имя поля в formData

// Обновление профиля пользователя
export const updateUserProfile = async (req: Request, res: Response): Promise<any> => {
  const userId = getUserIdFromToken(req);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { username, bio, website } = req.body;

    // Обновляем поля профиля, если они переданы
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (website) user.website = website;

    console.log(req.file);
    // Если присутствует файл изображения, загружаем его на Cloudinary
    if (req.file) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(req.file.buffer);

      try {
        // Загружаем изображение в Cloudinary
        const cloudinaryUpload = await new Promise((resolve, reject) => {
          bufferStream.pipe(
            cloudinary.uploader.upload_stream(
              {
                folder: 'user_profiles',
                resource_type: 'image',
                public_id: `${username}-profile`,
                overwrite: true,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
          );
        });

        // // Удаляем предыдущее изображение, если оно есть
        // if (user.profile_image) {
        //   const public_id = user.profile_image.split('/').pop()?.split('.')[0];
        //   if (public_id) {
        //     await cloudinary.uploader.destroy(public_id);
        //   }
        // }

        // Присваиваем URL изображения после успешной загрузки
        user.profile_image = (cloudinaryUpload as { secure_url: string }).secure_url; // Получаем безопасный URL изображения
      } catch (error) {
        return res.status(500).json({ message: 'Ошибка загрузки изображения', error: (error as Error).message });
      }
    }

    // Сохраняем обновленного пользователя в базе данных
    const updatedUser = await user.save();
    res.status(200).json(updatedUser); // Отправляем обновленные данные пользователя в ответ
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления профиля', error: (error as Error).message });
  }
};


//Получение всех пользователей
export const getAllUsers = async (req: Request, res: Response) : Promise<void> => {
    try{
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
}

// // Экспорт загрузки
// export const uploadProfileImage = upload.single('profile_image');

//Удаление учётной записи пользователя
export const deleteAccount = async (req: Request, res: Response) : Promise<void> => {
    const { userId } = req.params;
    try{
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
             res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
}
