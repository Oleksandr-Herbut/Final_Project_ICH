import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"; // Импортируем нужные функции из Redux Toolkit
import { $api } from "../../api/api"; // Импортируем API для выполнения запросов

// Интерфейс для поста
interface Post {
  _id: string;
  user_id: string;
  profile_image: string;
  photo: string;
  user_name: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

// Интерфейс для состояния
interface PostsState {
  posts: Post[]; // Массив постов
  loading: boolean; // Флаг загрузки
  error: string | null; // Ошибка, если она есть
}

// Начальное состояние
const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

// Thunks

// Получение всех постов
export const fetchAllPosts = createAsyncThunk("posts/fetchAllPosts", async () => {
  const response = await $api.get(`/posts/all`); // Получаем все посты
  return response.data.posts; // Возвращаем массив постов
});

// Получение всех публичных постов
export const fetchAllPublicPosts = createAsyncThunk("posts/fetchAllPublicPosts", async () => {
  const response = await $api.get("/posts/all/public"); // Получаем публичные посты
  return response.data.posts; // Возвращаем массив постов
});

// Получение постов другого пользователя
export const fetchOtherUserPosts = createAsyncThunk(
  "posts/fetchOtherUserPosts",
  async (userId: string) => {
    const response = await $api.get(`/posts/all/${userId}`); // Получаем посты другого пользователя
    return response.data.posts; // Возвращаем массив постов
  }
);

// Получение текущего поста
export const fetchCurrentPost = createAsyncThunk(
  "posts/fetchCurrentPost",
  async (postId: string) => {
    const response = await $api.get(`/posts/single/${postId}`); // Получаем один пост по ID
    return response.data.post; // Возвращаем пост
  }
)

// Лайк поста
export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const response = await $api.post(`/post/${postId}/like`, { userId }); // Лайк поста
    return { postId, likes_count: response.data.likes_count }; // Возвращаем ID поста и количество лайков
  }
);

// Обновление поста
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, updatedData }: { postId: string; updatedData: Partial<Post> }) => {
    const response = await $api.put(`/post/${postId}`, updatedData, {
      headers: {
        "Content-Type": "multipart/form-data", // Устанавливаем тип контента для обновления поста с фото
      },
    });
    return response.data; // Возвращаем обновленный пост
  }
);

// Slice
const postsSlice = createSlice({
  name: "posts", // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Нет дополнительных редьюсеров
  extraReducers: (builder) => {
    // Fetch all posts
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки в true
        state.error = null; // Обнуляем ошибку
      })
      .addCase(fetchAllPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false; // Завершаем загрузку
        state.posts = action.payload; // Обновляем список постов
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Failed to load posts"; // Добавляем ошибку, если загрузка не удалась
      });

    // Fetch all public posts
    builder
      .addCase(fetchAllPublicPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPublicPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload; // Обновляем список публичных постов
      })
      .addCase(fetchAllPublicPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load public posts"; // Ошибка при загрузке публичных постов
      });

    // Fetch other user posts
    builder
      .addCase(fetchOtherUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOtherUserPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false;
        state.posts = action.payload; // Обновляем список постов другого пользователя
      })
      .addCase(fetchOtherUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load user posts"; // Ошибка при загрузке постов другого пользователя
      });

    // Like post
    builder.addCase(likePost.fulfilled, (state, action: PayloadAction<{ postId: string, likes_count: number }>) => {
      const { postId, likes_count } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.likes_count = likes_count; // Обновляем количество лайков для поста
      }
    });

    // Update post
    builder.addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex((post) => post._id === updatedPost._id); // Ищем индекс обновленного поста
      if (index !== -1) {
        state.posts[index] = {
          ...state.posts[index],
          ...updatedPost, // Обновляем поля поста
        };
      }
    });
  },
});

export default postsSlice.reducer; // Экспортируем редьюсер слайса
