import express, { Router } from "express";
import { authenticateSocket } from "../middlewares/authMiddleware";
import { loadMessages, sendMessage, getChatUsers } from "../controllers/messageController";
import expressWs from "express-ws";

const app = express();
expressWs(app); // Добавляем поддержку WebSocket для приложения
const router = Router();

// Подключение к комнатам для чатов
router.ws("/joinRoom", authenticateSocket, loadMessages);

// Отправка сообщений в реальном времени
router.ws("/sendMessage", authenticateSocket, (ws, req) => {
  sendMessage(ws);
});

// Получение чатов
router.get("/chats", getChatUsers);

export default router;
