import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    auth(state, action) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    logout(state) {
      state.token = null;
      state.userId = null;
    },
  },
});

export const { auth, logout } = authSlice.actions;
export default authSlice.reducer;
