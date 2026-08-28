import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";

type User = { id: string; email: string };

type SessionState = {
  token: string | null;
  user: User | null;
};

const tokenKey = "bookstore_token";

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    token: localStorage.getItem(tokenKey),
    user: null,
  } as SessionState,
  reducers: {
    setSession: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem(tokenKey, action.payload.token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearSession: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem(tokenKey);
    },
  },
});

export const { setSession, setUser, clearSession } = sessionSlice.actions;

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;