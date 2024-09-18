import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../type";

const initialState: { info: null | User; token: null | string } = {
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
