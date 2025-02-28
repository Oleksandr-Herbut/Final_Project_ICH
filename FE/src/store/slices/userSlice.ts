import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"; // Импортируем необходимые функции из Redux Toolkit
import { getUserByIdApi } from "../../utils/utils"; // Импортируем API для получения данных о пользователе по ID
import { $api } from "../../api/api"; // Импортируем API для выполнения HTTP запросов
import { CondensedUser } from "../../store/types/instanceTypes"; // Импортируем тип для упрощенных данных пользователя

// Интерфейс для пользователя
interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  website: string;
  profile_image: string;
  followers: number;
  followings: number;
  posts_count: number;
  createdAt: string;
  lastMessage: string;
  __v: number;
}

// Интерфейс для состояния пользователя
interface UserState {
  user: User[]; // Список всех пользователей
  currentUser: null | User; // Текущий пользователь
  loading: boolean; // Статус загрузки данных
  error: string | null; // Ошибка при загрузке данных
  search_results: CondensedUser[]; // Результаты поиска
}

// Начальное состояние
const initialState: UserState = {
  user: [],
  currentUser: null,
  loading: false,
  error: null,
  search_results: [],
};

// Thunks

// Получение данных пользователя по ID
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId: string) => {
    const data = await getUserByIdApi(userId); // Получаем данные о пользователе
    return data;
  }
);

// Получение всех пользователей
export const getAllUsers = createAsyncThunk("user/getAllUsers", async () => {
  const response = await $api.get("/users"); // Получаем всех пользователей
  return response.data;
});

// Получение подписчиков пользователя
export const getFollow = createAsyncThunk(
  "user/getFollow",
  async (userId: string) => {
    const response = await $api.get(`/follow/${userId}/followers`); // Получаем подписчиков пользователя
    return response.data;
  }
);

// Получение пользователей, на которых подписан пользователь
export const getFollowing = createAsyncThunk(
  "user/getFollowing",
  async (userId: string) => {
    const response = await $api.get(`/follow/${userId}/following`); // Получаем список пользователей, на которых подписан пользователь
    return response.data;
  }
);

// Получение пользователей с перепиской
export const getUsersWithChats = createAsyncThunk(
  "user/getUsersWithChats",
  async () => {
    const response = await $api.get("/messages/chats"); // Получаем пользователей с перепиской
    return response.data;
  }
);

// Подписка на пользователя
export const followUser = createAsyncThunk(
  "user/followUser",
  async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
    const response = await $api.post(`/follows/${userId}/follow/${targetUserId}`); // Подписываемся на пользователя
    return response.data;
  }
);

// Отписка от пользователя
export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
    const response = await $api.post(`/follows/${userId}/unfollow/${targetUserId}`); // Отписываемся от пользователя
    return response.data;
  }
);

// Slice
const userSlice = createSlice({
  name: "user", // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Изменение времени последнего сообщения
    changeTimeInLastMessage: (state: UserState, { payload }) => {
      state.user = state.user.map((user) => {
        if (user._id === payload.userId) {
          return { ...user, lastMessage: payload.lastMessage }; // Обновляем время последнего сообщения
        }
        return user;
      });
    },

    // Добавление результата поиска
    addSearchResult: (state, action: PayloadAction<CondensedUser>) => {
      const exists = state.search_results.find(user => user._id === action.payload._id); // Проверяем, есть ли уже этот пользователь
      if (!exists) {
        state.search_results.push(action.payload); // Добавляем пользователя в список результатов поиска
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработчик для подписки на пользователя
      .addCase(followUser.pending, (state) => {
        state.loading = true; // Устанавливаем статус загрузки
        state.error = null; // Обнуляем ошибку
      })
      .addCase(followUser.fulfilled, (state) => {
        state.loading = false; // Завершаем загрузку
        // Обновляем текущего пользователя, увеличиваем количество подписчиков
        if (state.currentUser) {
          state.currentUser.followers += 1;
          state.currentUser.followings += 1;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Error following user"; // Устанавливаем ошибку
      })

      // Обработчик для отписки от пользователя
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true; // Устанавливаем статус загрузки
        state.error = null; // Обнуляем ошибку
      })
      .addCase(unfollowUser.fulfilled, (state) => {
        state.loading = false; // Завершаем загрузку
        // Обновляем текущего пользователя, уменьшаем количество подписчиков
        if (state.currentUser) {
          state.currentUser.followers -= 1;
          state.currentUser.followings -= 1;
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Error unfollowing user"; // Устанавливаем ошибку
      })

      // Получение данных пользователя по ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true; // Устанавливаем статус загрузки
        state.error = null; // Обнуляем ошибку
        state.currentUser = null; // Очищаем текущего пользователя
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.currentUser = action.payload || null; // Устанавливаем текущего пользователя
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Error loading posts"; // Устанавливаем ошибку
      })

      // Получение всех пользователей
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true; // Устанавливаем статус загрузки
        state.error = null; // Обнуляем ошибку
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.user = action.payload; // Обновляем список пользователей
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Error loading posts"; // Устанавливаем ошибку
      })

      // Получение подписчиков пользователя
      .addCase(getFollow.pending, (state) => {
        state.loading = true; // Устанавливаем статус загрузки
        state.error = null; // Обнуляем ошибку
      })
      .addCase(getFollow.fulfilled, (state, { payload }) => {
        state.loading = false; // Завершаем загрузку
        if (state.currentUser) {
          state.currentUser.followers = payload.length; // Обновляем количество подписчиков текущего пользователя
        }
      })
      .addCase(getFollow.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Error loading posts"; // Устанавливаем ошибку
      })

      // Получение пользователей, на которых подписан пользователь
      .addCase(getFollowing.pending, (state) => {
        state.loading = true; // Устанавливаем статус загрузки
        state.error = null; // Обнуляем ошибку
      })
      .addCase(getFollowing.fulfilled, (state, { payload }) => {
        state.loading = false; // Завершаем загрузку
        if (state.currentUser) {
          state.currentUser.followings = payload.length; // Обновляем количество подписок текущего пользователя
        }
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Error loading posts"; // Устанавливаем ошибку
      })

      // Получение пользователей с перепиской
      .addCase(getUsersWithChats.pending, (state) => {
        state.loading = true; // Устанавливаем статус загрузки
        state.error = null; // Обнуляем ошибку
      })
      .addCase(getUsersWithChats.fulfilled, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.user = action.payload; // Обновляем список пользователей с перепиской
      })
      .addCase(getUsersWithChats.rejected, (state, action) => {
        state.loading = false; // Завершаем загрузку
        state.error = action.error.message || "Ошибка при загрузке пользователей с перепиской"; // Устанавливаем ошибку
      });
  },
});

// Экспортируем действия слайса
export const { changeTimeInLastMessage, addSearchResult } = userSlice.actions;
export default userSlice.reducer;
