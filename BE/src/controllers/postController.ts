import { existsSync, writeFileSync, unlinkSync } from "fs";
import axios from "axios";
import { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";
import multer from "multer";
import { AnyArray } from "mongoose";
import Follow from "../models/Follow";

// Получение постов конкретного пользователя
export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find({ author: req.user?.id }).populate("author");
    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
  }
};

// Создание поста
export const createPost = async (req: Request, res: Response): Promise<any> => {
    const { content, userId, website = "", photo } = req.body;
    const file = req.file;

    try {
        let photoUrl = "";

        if (photo) {
            // Если передан URL изображения, загружаем его и отправляем в Cloudinary
            console.log("Downloading image from URL:", photo);
            const tempFilePath = "./temp_image.jpg";
            const response = await axios.get(photo, { responseType: "arraybuffer" });

            if (!response.data) {
                console.error("Failed to download image from URL:", photo);
                res.status(400).json({ error: "Invalid image URL" });
                return;
            }

            writeFileSync(tempFilePath, Buffer.from(response.data, "binary"));

            // console.log("Uploading downloaded image to Cloudinary...");
            const uploadResult = await uploadToCloudinary(tempFilePath, "posts");
            photoUrl = uploadResult.secure_url;

            if (existsSync(tempFilePath)) {
                unlinkSync(tempFilePath);
            }
        } else if (file) {
            console.log("Uploading local file to Cloudinary...");
            const uploadResult = await uploadToCloudinary(file, "posts");
            photoUrl = uploadResult.secure_url;
        } else {
            console.error("No file or valid URL provided!");
            return res.status(400).json({ error: "No valid image provided" });
        }

        const newPost = new Post({ author: userId, photo: photoUrl, content, website });
        await newPost.save();

        await User.findByIdAndUpdate(userId, {
            $inc: { postsCount: 1 },
            $push: { posts: newPost._id }
        });

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
};

// Обновление поста
export const updatePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const file = req.file;

    if (!content) {
      return res.status(400).json({ error: "Post content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let updateData: any = { content };
    if (file) {
      if (post.photo) {
        const publicId = post.photo.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }

      const result = await uploadToCloudinary(file.path, "posts");
      updateData.photo = result.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    return res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong, please try again later" });
  }
};

// Удаление поста
export const deletePost = async (req: Request, res: Response): Promise<any> => {
  const { postId } = req.params;

  try {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }

    // Уменьшаем счетчик постов у пользователя
    await User.findByIdAndUpdate(post.author, { $inc: { postsCount: -1 }, $pull: { posts: post._id } });

    // Удаление изображения из Cloudinary
    if (post.photo) {
      const publicId = post.photo.split("/").pop()?.split(".")[0];
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
  }
};

// Получение всех постов
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Получаем все посты и популяции авторов и других связанных данных
    const posts = await Post.find().populate("author");
    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
  }
};

// Получение постов другого пользователя
export const getOtherProfilePosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ author: userId }).populate("author");
    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (err) {
    console.error("Error in getOtherUserPosts:", err);
    res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
  }
}


// Получение постов подписанных пользователей
export const getFollowingPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User is not authenticated" });
    }

    const userId = req.user.id; // ID текущего пользователя
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;

    const followingUsers = await User.findById(userId).populate("followings");
    if (!followingUsers) {
      console.log("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }
    const followingPosts = await Post.find({ author: { $in: followingUsers.followings } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "username profile_image")
    .populate("likes", "user");

    res.status(200).json({ message: "Following posts fetched successfully", posts: followingPosts });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
  }
};

// Получение поста по ID
export const getPostById = async (req: Request, res: Response): Promise<any> => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate("author");
    if (!post) {
      return res.status(404).json({ error: "Post not found" }); // Завершаем выполнение функции здесь
    }
    return res.status(200).json({ message: "Post fetched successfully", post }); // Завершаем выполнение функции здесь
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
  }
};

 