import jwt from "jsonwebtoken";
import { IncomingHttpHeaders } from "http";

// Получение идентификатора пользователя из токена
const getUserIdFromToken = (req: { headers: IncomingHttpHeaders }): string => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.decode(token as string);
  return (decoded as { id: string }).id;
};

export default getUserIdFromToken;