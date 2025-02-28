import { $api } from "../api/api";
import { LikesFields } from "../store/types/instanceTypes";



export const getUserByIdApi = async (actionMaker: string) => {
  try {
    const { data } = await $api.get(`/users/${actionMaker}`);
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Ошибка при получении пользователя");
  }
};

// Функция для форматирования времени
export const formatDate = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return postDate.toLocaleDateString();
};

//
export const formatMessageTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();

  const hours = d.getHours();
  const minutes = d.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  const isToday = d.toDateString() === now.toDateString();
  const isThisWeek = now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;

  if (isToday) {
      // Format: "13:40"
      return `${formattedHours}:${formattedMinutes}`;
  } else if (isThisWeek) {
      // Format: "Сб 14:43"
      const day = daysOfWeek[d.getDay()];
      return `${day} ${formattedHours}:${formattedMinutes}`;
  } else {
      // Format: "28.12.2024, 18:22"
      const day = d.getDate();
      const month = d.getMonth() + 1; // Months are zero-based
      const year = d.getFullYear();
      return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}, ${formattedHours}:${formattedMinutes}`;
  }
};

const parseData = (date: string | null) => {
  if (!date) return "N/A"; // Возвращает "N/A" для отсутствующих дат
  const parsedDate = new Date(date);
  if (isNaN(+parsedDate)) return "Invalid Date";

  const now = new Date();
  const diffMs = now.getTime() - parsedDate.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMin > 5 && diffMin < 60 && diffHours <= 0) {
    return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
  }
};

export default parseData;




export const isLikedByUser = (likedBy: LikesFields[], userId: string) => {
  if (!userId) return;
  const res = likedBy.filter(like => like.user === userId);
  return res.length > 0;
};

export const onLikePostFromHomepage = async (postId: string) => {
  try {
    const response = await $api.post(`/post/like/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};