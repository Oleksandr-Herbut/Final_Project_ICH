import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Импортируем необходимые функции из Redux Toolkit
import { $api } from '../../api/api'; // Импортируем экземпляр API для работы с сервером
import { Comment } from '../types/instanceTypes'; // Импортируем тип Comment

// Fetch comments — асинхронный экшен для получения комментариев
export const fetchComments = createAsyncThunk(
  'comments/fetchComments', // Название экшена
  async (postId: string, { rejectWithValue }) => { // Получаем postId, для которого нужно получить комментарии
    try {
      const response = await $api.get(`/comments/${postId}`); // Отправляем GET запрос на сервер
      return response.data; // Если запрос успешен, возвращаем данные (комментарии)
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching comments'); // Если ошибка, возвращаем ошибку
    }
  }
);

// Add comment — асинхронный экшен для добавления комментария
export const addComment = createAsyncThunk(
  'comments/addComment', // Название экшена
  async ({ postId, userId, content, profile_image }: { postId: string; userId: string; content: string; profile_image: string }, { rejectWithValue }) => {
    try {
      // Отправляем POST запрос для добавления нового комментария
      const response = await $api.post(`/comments/${postId}`, { userId, content, profile_image });
      return response.data; // Если запрос успешен, возвращаем добавленный комментарий
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error adding comment'); // В случае ошибки возвращаем ошибку
    }
  }
);

// Like comment — асинхронный экшен для лайка комментария
export const likeComment = createAsyncThunk(
  'comments/likeComment', // Название экшена
  async ({ commentId, userId }: { commentId: string; userId: string }, { rejectWithValue }) => {
    try {
      // Отправляем POST запрос для лайка комментария
      const response = await $api.post(`/comments/like/${commentId}`, { userId });
      return response.data; // Если запрос успешен, возвращаем обновленные данные комментария
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error liking comment'); // В случае ошибки возвращаем ошибку
    }
  }
);

// Слайс для работы с комментариями
const commentsSlice = createSlice({
  name: 'comments', // Имя слайса
  initialState: { comments: [] as Comment[], loading: false, error: null }, // Начальное состояние
  reducers: {
    // Редьюсер для установки комментариев (например, после загрузки)
    setComments: (state, action) => {
      state.comments = action.payload; // Обновляем список комментариев в состоянии
    },
  },
  extraReducers: (builder) => { // Обработчики для асинхронных экшенов
    builder
      .addCase(fetchComments.fulfilled, (state, action) => { // Когда асинхронный экшен fetchComments завершен успешно
        state.comments = action.payload; // Заполняем комментариями
      })
      .addCase(addComment.fulfilled, (state, action) => { // Когда асинхронный экшен addComment завершен успешно
        state.comments.push(action.payload); // Добавляем новый комментарий в список
      })
      .addCase(likeComment.fulfilled, (state, action) => { // Когда асинхронный экшен likeComment завершен успешно
        const index = state.comments.findIndex((c: any) => c._id === action.payload._id); // Находим индекс обновленного комментария
        if (index !== -1) {
          state.comments[index] = action.payload; // Обновляем комментарий в состоянии
        }
      });
  },
});

// Экспортируем экшен для установки комментариев
export const { setComments } = commentsSlice.actions;

// Экспортируем редьюсер, чтобы подключить его в стор
export default commentsSlice.reducer;
