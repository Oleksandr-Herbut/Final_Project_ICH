import e, { Request, Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";
import Notification from "../models/Notification";
import { error } from "console";

// Получние коментариев
export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId }).populate("user");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
  }
};

// Создание комментария
export const createComment = async (req: Request, res: Response) => {
    const {postId} = req.params;
    const {content, userId} = req.body;

    try {
        const newComment = new Comment({post: postId, user: userId, content});
        await newComment.save();

        // Увеличиваем счетчик комментариев у поста
        await Post.findByIdAndUpdate(postId, {$inc: {comments_count: 1 }, $push: {comments: newComment._id}}, );
        
        // Создаем уведомление для автора поста
        const post = await Post.findById(postId);
        if(post) {
            const notification = new Notification({user: post.author, actionMaker: userId, post: postId, type: "commented on your post"});
            await notification.save();
        }

        res.status(201).json({message: "Comment created successfully", comment: newComment});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
};

// Удаление комментария
export const deleteComment = async (req: Request, res: Response) : Promise<void> => {
    const { commentId } = req.params;
    
    try {
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
             res.status(404).json({ message: "Comment not found" });
        }

        // Уменьшаем счетчик комментариев у поста
        if (comment) {
            await Post.findByIdAndUpdate(comment.post, {$inc: {comments_count: -1}, $pull: {comments: comment._id}});
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
};


// Лайк/дизлайк комментария
// Лайк/дизлайк комментария
export const likeComment = async (req: Request, res: Response): Promise<any> => {
    const { commentId } = req.params;
    const { userId } = req.body;
  
    try {
      // Находим комментарий
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      // Проверяем, есть ли userId в массиве likes
      const hasLiked = comment.likes.some((id: any) => id.toString() === userId);
  
      if (hasLiked) {
        // Если лайк уже есть, удаляем его
        comment.likes = comment.likes.filter((id: any) => id.toString() !== userId);
        comment.likes_count -= 1;
      } else {
        // Если лайка нет, добавляем
        comment.likes.push(userId);
        comment.likes_count += 1;
  
        // Создаём уведомление только при добавлении лайка
        const notification = new Notification({
          user: comment.user,
          actionMaker: userId,
          comment: commentId,
          type: "liked your comment",
        });
        await notification.save();
      }
  
      // Сохраняем изменения
      await comment.save();
  
      res.status(200).json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
  };
  
  
// Обновление комментария (не уверен в том что это нужно)
// export const updateComment = async (req: Request, res: Response) => {
//     const { commentId } = req.params;
//     const { text } = req.body;

//     try {
//         const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });
//         if (!comment) {
//             return res.status(404).json({ message: "Comment not found" });
//         }
//         res.status(200).json(comment);
//     } catch (err) {
//         res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
//     }
// }
        
