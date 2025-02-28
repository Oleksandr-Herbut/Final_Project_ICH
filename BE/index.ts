
import express from "express";
import connect from "./src/db/db";
import http from "http";
import "dotenv/config";
import mainRouter from "./src/routes/mainRouter";
import cors, { CorsOptions } from "cors";
// import { configureCors } from "./src/config/cors";




const port: string | number = process.env.PORT || 3000;


(async function startServer() {
  try {
    await connect();
    const app: express.Application = express();
    const server = http.createServer(app);

    app.use(cors());
    // app.use(cors(configureCors as CorsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Использование mainRouter для всех маршрутов
    app.use("/api", mainRouter);

    server.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });
  } catch (error) {
    console.log("Ошибка при запуске сервера", error);
  }
})();
