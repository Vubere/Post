import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  info: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo: (state, { payload }) => {
      state.info = payload;
    },
    updateToken: (state, { payload }) => {
      state.token = payload;
    },
    destroyUserState: (state) => {
      state = {
        token: null,
        info: null,
      };
    },
  },
});
export const { updateUserInfo, updateToken, destroyUserState } =
  userSlice.actions;

export default userSlice.reducer;
