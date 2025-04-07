import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 异步更新设置
export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      // 这里可以添加API调用来保存设置到后端
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      return settings;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 初始设置状态
const initialState = {
  language: 'zh-CN',
  theme: 'light',
  notifications: true,
  fontSize: 14,
  graphZoomLevel: 1,
  dataStorage: 'local',
  clearDataOnExit: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // 直接更新设置（同步）
    setSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
    // 重置设置
    resetSettings: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSettings.fulfilled, (state, action) => {
        // 更新成功后更新状态
        return { ...state, ...action.payload };
      })
      .addCase(updateSettings.rejected, (state, action) => {
        // 可以在这里处理错误，例如设置错误消息
        console.error('设置更新失败:', action.payload);
      });
  },
});

export const { setSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;