import { Request, Response } from 'express';
import Notification from '../models/Notification';

// Получение уведомлений
export const getNotification = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ user: userId });
        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({
            error: 'Failed to fetch notifications',
            details: (err as Error).message,
        });
    }
};

// Создание уведомления
export const createNotification = async (req: Request, res: Response) => {
    const { userId, type, message, actionMakerId, postId, commentId } = req.body;

    try {
        const newNotification = new Notification({
            user: userId,
            type,
            message,
            actionMaker: actionMakerId,
            post: postId,
            comment: commentId,
        });

        await newNotification.save();

        res.status(201).json({message: 'Notification created successfully', notification: newNotification,});
    } catch (err) {
        console.error('Error creating notification:', err);
        res.status(500).json({error: 'Failed to create notification', details: (err as Error).message,});
    }
};

// Удаление уведомления
export const deleteNotification = async (req: Request, res: Response) : Promise<any> => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error('Error deleting notification:', err);
        res.status(500).json({
            error: 'Failed to delete notification',
            details: (err as Error).message,
        });
    }
};

// Обновление статуса уведомления
export const updateNotificationStatus = async (req: Request, res: Response) : Promise<any> => {
    const { notificationId } = req.params;
    const { isRead } = req.body;

    try {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({
            message: 'Notification status updated successfully',
            notification,
        });
        return
    } catch (err) {
        console.error('Error updating notification status:', err);
        res.status(500).json({
            error: 'Failed to update notification status',
            details: (err as Error).message,
        });
    }
};
