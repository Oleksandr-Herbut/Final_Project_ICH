import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Загружает файл в Cloudinary.
 * @param {Express.Multer.File | string} file - Файл (Multer) или путь к файлу.
 * @param {string} folder - Папка в Cloudinary.
 * @returns {Promise<{ secure_url: string; public_id: string }>}
 */
export const uploadToCloudinary = async (
    file: Express.Multer.File | string,
    folder: string = "default"
): Promise<{ secure_url: string; public_id: string }> => {
    if (!file) {
        throw new Error("File path or buffer is missing in uploadToCloudinary");
    }

    try {
        let result;
        if (typeof file === "string") {
            // Если передан путь к файлу
            result = await cloudinary.uploader.upload(file, { folder });
            await unlink(file); // Удаляем временный файл после загрузки
        } else {
            // Если передан Buffer (файл в памяти)
            result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(new Error("Failed to upload image to Cloudinary"));
                    } else {
                        resolve(result!);
                    }
                });
                uploadStream.end(file.buffer);
            });
        }

        return { secure_url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
};

/**
 * Удаляет изображение из Cloudinary.
 * @param {string} publicId - Public ID изображения в Cloudinary.
 * @returns {Promise<{ result: string }>}
 */
export const deleteFromCloudinary = async (publicId: string): Promise<{ result: string }> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
        throw new Error("Failed to delete image from Cloudinary");
    }
};
