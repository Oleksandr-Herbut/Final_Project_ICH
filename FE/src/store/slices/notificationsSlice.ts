import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { $api } from "../../api/api";

// Асинхронный thunk для получения действий пользователя (уведомлений)
export const fetchUserNotifications = createAsyncThunk(
  "notifications/fetchUserNotifications",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await $api.get(`/notifications/${userId}/actions`);
      return response.data;
    } catch (error: unknown) {
      // Обработка ошибок и возврат значения с ошибкой
      return rejectWithValue(
        (error as { response?: { data: string } })?.response?.data || "Ошибка при загрузке уведомлений"
      );
    }
  }
);

// Slice для управления состоянием уведомлений
const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { actions: [], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка состояния при ожидании загрузки уведомлений
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Обработка успешной загрузки уведомлений
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // Ограничение до последних 10 действий
        state.actions = action.payload.slice(0, 10);
      })
      // Обработка ошибки при загрузке уведомлений
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default notificationsSlice.reducer;
