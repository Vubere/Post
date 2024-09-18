import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import { persistReducer, persistStore } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { userApi } from "@/app/_lib/api/user";
import { postApi } from "@/app/_lib/api/post";

const persistConfig = {
  key: "collections-root",
  whitelist: ["user"],
  storage,
};
//@ts-ignore
const rootReducer = combineReducers({
  user: userReducer,
  [postApi.reducerPath]: postApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

//@ts-ignore
export const store = configureStore({
  reducer: rootReducer,
  //@ts-ignore
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, postApi.middleware),
});
setupListeners(store.dispatch);
export const getState = store.getState;
//@ts-ignore
export type RootState = ReturnType<typeof store.getState>;
//@ts-ignore
export type AppDispatch = typeof store.dispatch;
