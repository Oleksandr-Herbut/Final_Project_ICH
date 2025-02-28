import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import WebSocket from "ws";

// Загрузка истории сообщений
export const loadMessages = async (ws: WebSocket, req: Request): Promise<void> => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId }).populate("sender").populate("receiver");
    ws.send(JSON.stringify(messages));
  } catch (err) {
    ws.send(JSON.stringify({ error: "Something went wrong, please try again later", err: (err as Error).message }));
  }
};

// Отправка сообщения
export const sendMessage = (ws: WebSocket): void => {
  ws.on('message', async (message: string) => {
    const { chatId, senderId, receiverId, content } = JSON.parse(message);

    try {
      const newMessage = new Message({ chat: chatId, sender: senderId, receiver: receiverId, content });
      await newMessage.save();

      // Обновление последнего сообщения в чате
      await Chat.findByIdAndUpdate(chatId, { last_message: newMessage._id });

      ws.send(JSON.stringify(newMessage));
    } catch (err) {
      ws.send(JSON.stringify({ error: "Failed to send message", err: (err as Error).message }));
    }
  });
};

// Получение пользователей с перепиской
export const getChatUsers = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ $or: [{ user1: userId }, { user2: userId }] }).populate('user1').populate('user2').populate('last_message');
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong, please try again later", error: (err as Error).message });
  }
};
