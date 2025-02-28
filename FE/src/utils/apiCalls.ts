
import { $api } from "../api/api"; // Assuming $api is an AxiosInstance


// Функция для проверки валидности JWT-токена
export const validateToken = async () => {
  try {
    const response = await $api.get("/auth/check-access-token");
    return response.data.message === "Token is valid";
  } catch (err) {
    console.warn("Error during token validation:", err);
    return false;
  }
};

// Добавление комментария к посту
export const addComment = async (content: string, postId: string) => {
  try {
    const { data } = await $api.post(`/comments/${postId}/add`, { content });
    return data;
  } catch (err) {
    console.warn("Failed to add a comment:", err);
  }
};

// Лайк для комментария
export const likeComment = async (commentId: string) => {
  try {
    const { data } = await $api.post(`/comments/${commentId}/like`);
    return data;
  } catch (err) {
    console.warn("Error liking a comment:", err);
  }
};

// Удаление лайка с комментария
export const unlikeComment = async (commentId: string) => {
  try {
    const { data } = await $api.delete(`/comments/${commentId}/unlike`);
    return data;
  } catch (err) {
    console.warn("Error removing like from comment:", err);
  }
};

// Лайк для поста
export const likePost = async (postId: string, userId: string) => {
  try {
    const { data } = await $api.post(`/likes/${postId}/${userId}`);
    return data;
  } catch (err) {
    console.warn("Error liking a post:", err);
  }
};

// Удаление лайка с поста
export const unlikePost = async (postId: string, userId: string ) => {
  try {
    const { data } = await $api.delete(`/likes/${postId}/${userId}`);
    return data;
  } catch (err) {
    console.warn("Error unliking a post:", err);
  }
};

// Получение профиля пользователя
export const fetchUserProfile = async (username: string) => {
  try {
    const { data } = await $api.get(`/users/${username}`);
    return data[0];
  } catch (err) {
    console.warn("Error fetching user profile:", err);
  }
};

// Удаление поста
export const deletePost = async (postId: string) => {
  try {
    const { data } = await $api.delete(`/posts/${postId}`);
    return data;
  } catch (err) {
    console.warn("Error deleting post:", err);
  }
};

// Подписка на пользователя
export const followUser = async (userId: string, targetUserId: string): Promise<void> => {
  try {
    const { data } = await $api.post(`/follows/${userId}/follow/${targetUserId}`);
    return data;
  } catch (err) {
    console.warn("Error following user:", err);
  }
};

// Отписка от пользователя
export const unfollowUser = async (userId: string, targetUserId: string): Promise<void> => {
  try {
    const { data } = await $api.delete(`follows/${userId}/unfollow/${targetUserId}`);;
    return data;
  } catch (err) {
    console.warn("Error unfollowing user:", err);
  }
};


// Получение всех пользователей для поиска
export const getUsersForSearch = async () => {
  try {
    const { data } = await $api.get("/users");
    return data;
  } catch (err) {
    console.warn("Error fetching users for search:", err);
  }
};

// Получение чата с конкретным пользователем
export const fetchChat = async (receiverUsername: string) => {
  try {
    const { data } = await $api.post("/messages/get_chat", { receiverUsername });
    return data;
  } catch (err) {
    console.warn("Error fetching chat messages:", err);
  }
};

// Получение всех чатов пользователя
export const fetchUserChats = async () => {
  try {
    const { data } = await $api.get("/messages/get_user_chats");
    return data;
  } catch (err) {
    console.warn("Error fetching user chats:", err);
  }
};

// Получение постов от подписанных пользователей
export const fetchFollowedPosts = async (page: number) => {
  try {
    const { data } = await $api.get(`/posts/followed`, { params: { page } });
    return data;
  } catch (err) {
    console.warn("Error fetching followed posts:", err);
  }
};

// Получение случайных постов
export const fetchRandomPosts = async (count: number) => {
  try {
    const { data } = await $api.get(`/posts/random`, { params: { count } });
    return data;
  } catch (err) {
    console.warn("Error fetching random posts:", err);
  }
};

// Добавление пользователя в результаты поиска
export const addUserToSearchResults = async (username: string) => {
  try {
    const { data } = await $api.post("/users/add_to_search_results", { username });
    return data;
  } catch (err) {
    console.warn("Error adding user to search results:", err);
  }
};

// Проверка, подписан ли пользователь на другого пользователя
export const checkFollowingStatus = async (userId: string, targetUserId: string) => {
  try {
    const { data } = await $api.get(`/follows/${userId}/isFollowing/${targetUserId}`);
    return data.isFollowing;
  } catch (err) {
    console.warn("Error checking following status:", err);
  }
};
