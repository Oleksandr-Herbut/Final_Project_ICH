import { Request, Response } from "express";
import User from "../models/User";
import Follow from "../models/Follow";
import Notification from "../models/Notification";
import { JwtPayload } from "jsonwebtoken";
import 'dotenv/config';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Получение подписчиков
export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const followers = await Follow.find({ follower_id: userId }).populate("user_id");
    res.status(200).json(followers);
  } catch (err) {
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
  }
};

// Получение подписок
export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const following = await Follow.find({ user_id: userId }).populate("follower_id");
    res.status(200).json(following);
  } catch (err) {
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
  }
};

// Подписка на пользователя
export const followUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, targetUserId } = req.params;

  try {
    // Проверка, существует ли уже следование
    const existFollow = await Follow.findOne({ user_id: userId, follower_id: targetUserId });
    if (existFollow) {
      res.status(400).json({ message: "You are already following this user", isFollowing: true });
      return;
    }

    // Создание следования
    const follow = await Follow.create({ user_id: userId, follower_id: targetUserId });
    await follow.save();

    // Обновление счетчиков
    await User.findByIdAndUpdate(targetUserId, { $push: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $push: { followings: targetUserId } });

    // Создание уведомления
    const notification = new Notification({
      user: targetUserId,
      actionMaker: userId,
      type: "started following you",
    });
    await notification.save();

    res.status(201).json({ message: "Followed successfully", follow, isFollowing: true });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
  }
};

// Отписка от пользователя
export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, targetUserId } = req.params;

  try {
    // Находим и удаляем следование
    const follow = await Follow.findOneAndDelete({ user_id: userId, follower_id: targetUserId, isFollowing: false });
    if (!follow) {
      res.status(404).json({ message: "You are not following this user" });
      return;
    }

    // Обновляем счетчики
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { followings: targetUserId } });

    res.status(200).json({ message: "Unfollowed successfully", follow, isFollowing: false });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
    }
  }
};

// Проверка наличия подписки на пользователя
export const checkIfFollowing = async (req: Request, res: Response) : Promise<any> => {
  const { userId, targetUserId } = req.params;
  // console.log(`Checking if user ${userId} is following ${targetUserId}`);

  try {
    const follow = await Follow.findOne({
      user_id: targetUserId,
      follower_id: userId,
    });

    if (follow) {
      // console.log('Follow record found:', follow);
      return res.json({ isFollowing: true });
    } else {
      // console.log('No follow record found');
      return res.json({ isFollowing: false });
    }
  } catch (err) {
    console.error('Error checking follow status:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// // Проверка наличия следования
// export const checkFollow = async (req: Request, res: Response): Promise<void> => {
//   const { userId, targetUserId } = req.params;

//   try {
//     const follow = await Follow.findOne({ user_id: userId, follower_id: targetUserId });
//     if (follow) {
//       res.status(200).json({ message: "You are following this user" });
//     } else {
//       res.status(200).json({ message: "You are not following this user" });
//     }
//   } catch (err) {
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
//     }
//   }
// };

// //Подписка на пользователя
// export const followUser = async (req: Request, res: Response): Promise<void> => {
//   const {targetUserId} = req.params;

//   const authHeader = req.headers.authorization;
  
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     res.status(401).json({ message: "Authorization header is missing or invalid" });
//     return;
//   }

//   const token = authHeader.split(" ")[1];
  
//   const verifyToken = (token: string) => {
//     return jwt.verify(token, process.env.JWT_SECRET as string);
//   };

//   try {
//     const decoded = verifyToken(token) as JwtPayload;
//     const userId = decoded.id;

//     if (userId === targetUserId) {
//       res.status(400).json({ message: "You cannot follow yourself" });
//       return;
//     }

//     const currentUser = await User.findById(userId);
//     const userToFollow = await User.findById(targetUserId);

//     if (!currentUser || !userToFollow) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }
//     if (!currentUser.followings.includes(new mongoose.Types.ObjectId(targetUserId))) {
//       currentUser.followings.push(new mongoose.Types.ObjectId(targetUserId));
//       userToFollow.followers.push(new mongoose.Types.ObjectId(userId));

//       await currentUser.save();
//       await userToFollow.save();

//       res.status(201).json({ message: "Followed successfully" });
//     } else {
//       res.status(400).json({ message: "You are already following this user" });
//     }
//   } catch (err) {
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
//     }
//   }
// }

// //Отписка от пользователя
// export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
//   const {targetUserId} = req.params;

//   const authHeader = req.headers.authorization;
  
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     res.status(401).json({ message: "Authorization header is missing or invalid" });
//     return;
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
//     const userId = decoded.id;

//     const currentUser = await User.findById(userId);
//     const userToUnfollow = await User.findById(targetUserId);

//     if (!currentUser || !userToUnfollow) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     currentUser.followings = currentUser.followings.filter((id) => id.toString() !== targetUserId.toString());
//     userToUnfollow.followers = userToUnfollow.followers.filter((id) => id.toString() !== userId.toString());

//     await currentUser.save();
//     await userToUnfollow.save();

//     res.status(200).json({ message: "Unfollowed successfully" });
//   } catch (err) {
//     if (!res.headersSent) {
//       res.status(500).json({ error: "Something went wrong, please try again later", err: (err as Error).message });
//     }
//   }
// }

