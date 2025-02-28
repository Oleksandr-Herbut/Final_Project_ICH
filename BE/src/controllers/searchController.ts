import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";

// Поиск пользователей по имени
export const searchUsers = async (req: Request, res: Response)  => {
    const { search } = req.query;
    try {
        const users = await User.find({ username: new RegExp(search as string, "i") });
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
};

//Поиск постов
export const searchPosts = async (req: Request, res: Response) => {
    const { search } = req.query;
    try {
        const posts = await Post.find({ content: new RegExp(search as string, "i") }).populate("author");
        res.status(200).json({ message: "Posts fetched successfully", posts });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
}