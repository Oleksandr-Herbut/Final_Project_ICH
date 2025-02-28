import mongoose from "mongoose";
import "dotenv/config";

const url: string =
  process.env.MONGO_URL || "mongodb://localhost:27017/ichgram";

async function connect() {
  try {
    await mongoose.connect(url, {
    
    });
    console.log("Подключение к базе данных установлено");
  } catch (error) {
    console.error({ "Ошибка подключения к базе данных": error });
    process.exit(1);
  }
}

export default connect;
