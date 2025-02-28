import { Request, Response } from "express";
import Like from "../models/Like";
import Post from "../models/Post";
import Notification from "../models/Notification";

// Получение лайков поста
export const getLikePost = async (req: Request, res: Response) : Promise<void> => {
    const { postId } = req.params;

    try {
        // Получаем всех пользователей, которые лайкнули пост
        const likes = await Like.find({ post: postId }).populate("user");
        res.status(200).json(likes);
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
         return;
    }
};

// Лайк поста
export const likePost = async (req: Request, res: Response)  : Promise<any> => {
    const {postId, userId} = req.params;

    try {
        // Проверяем существует ли лайк
        const existLike = await Like.findOne({user: userId, post: postId});
        if (existLike) {
             res.status(400).json({ message: "You already like this post" });
             return;
        }
        const like = await Like.create({post: postId, user: userId});
        await like.save();

        // Увеличиваем счетчик лайков у поста
        await Post.findByIdAndUpdate(postId, {$inc: {like_count: 1}, $push: {likes: like._id}});
        
        // Создаем уведомление для автора поста
        const post = await Post.findById(postId);
        if (post) {
            const notification = new Notification({user: post.author, actionMaker: userId, post: postId, type: "liked your post"});
            await notification.save();
        }

        res.status(201).json({ message: "Like created successfully", like });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
};

// Удаление лайка
export const deleteLike = async (req: Request, res: Response) : Promise<void> => {
    const {postId, userId} = req.params;

    try {
        // Проверяем существует ли лайк
        const like = await Like.findOneAndDelete({user: userId, post: postId});
        if (!like) {
             res.status(404).json({ message: "Like not found" });
        } else {
            // Уменьшаем счетчик лайков у поста
            await Post.findByIdAndUpdate(postId, {$inc: {like_count: -1}, $pull: {likes: like._id}});
        }

        res.status(200).json({ message: "Like deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
};

//Получение лайков пользователя
export const getLikeUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Получаем все посты, которые лайкнул пользователь
        const likes = await Like.find({ user: userId }).populate("post");
        res.status(200).json({message: "Likes found successfully", likes});
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
};