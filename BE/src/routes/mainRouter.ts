import express from "express";
import authRoutes from "../routes/authRoutes";
import commentRoutes from "../routes/commentRoutes";
import followRoutes from "../routes/followRoutes";
import likeRoutes from "../routes/likeRoutes";
import messageRoutes from "../routes/messageRoutes";
import notificationRoutes from "../routes/notificationRoutes";
import postRoutes from "../routes/postRoutes";
import searchRoutes from "../routes/searchRoutes";
import userRoutes from "../routes/userRoutes";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/comments", commentRoutes);
router.use("/follows", followRoutes);
router.use("/likes", likeRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);
router.use("/posts", postRoutes);
router.use("/search", searchRoutes);
router.use("/users", userRoutes);

export default router;
