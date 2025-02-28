import multer from "multer";

const storage = multer.memoryStorage(); // Сохраняем файл в памяти
const upload = multer({ storage });

export default upload;
