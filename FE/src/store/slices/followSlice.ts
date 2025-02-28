import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; // Импортируем необходимые функции из Redux Toolkit
import { $api } from "../../api/api"; // Импортируем экземпляр API для работы с сервером

// Описание интерфейса состояния подписок
interface IFollowState {
  follower: null | string[]; // Состояние подписчиков (список идентификаторов пользователей)
  following: null | string[]; // Состояние подписок (список идентификаторов пользователей)
}

// Начальное состояние подписок
const initialState: IFollowState = {
  follower: null, // Изначально нет подписчиков
  following: null, // Изначально нет подписок
};

// Thunk для получения подписчиков пользователя
export const fetchFollowers = createAsyncThunk(
  "user/fetchFollowers", // Название экшена
  async (userId: string) => { // Получаем userId, для которого нужно получить список подписчиков
    const response = await $api.get(`/follow/${userId}/followers`); // Отправляем GET запрос на сервер
    return response.data; // Возвращаем данные (список подписчиков)
  }
);

// Thunk для получения подписок пользователя
export const fetchFollowing = createAsyncThunk(
  "user/fetchFollowing", // Название экшена
  async (userId: string) => { // Получаем userId, для которого нужно получить список подписок
    const response = await $api.get(`/follow/${userId}/following`); // Отправляем GET запрос на сервер
    return response.data; // Возвращаем данные (список подписок)
  }
);

// Slice для управления состоянием подписок
const followSlice = createSlice({
  name: "follow", // Имя слайса
  initialState, // Начальное состояние слайса
  reducers: {}, // Здесь нет обычных редьюсеров, так как работа идет с асинхронными экшенами
  extraReducers: (builder) => { // Обработчики для асинхронных экшенов
    builder
      // Обработка успешного получения подписчиков пользователя
      .addCase(fetchFollowers.fulfilled, (state, { payload }) => {
        // Если экшен fetchFollowers завершился успешно, обновляем состояние подписок
        state.following = payload.map((item: typeof payload) => item.user_id._id); // Мапируем полученные данные на массив user_id
      })
      // Обработка успешного получения подписок пользователя
      .addCase(fetchFollowing.fulfilled, (state, { payload }) => {
        // Если экшен fetchFollowing завершился успешно, обновляем состояние подписок
        state.follower = payload.map((item: typeof payload) => item.user_id._id); // Мапируем полученные данные на массив user_id
      });
  },
});

export default followSlice.reducer; // Экспортируем редьюсер, чтобы подключить его в стор
