import { configureStore, combineReducers } from "@reduxjs/toolkit";
import preferences from "./preferencesSlice";
import favorites from "./favoritesSlice";
import content from "./contentSlice";
import auth from "./authSlice";

const rootReducer = combineReducers({ preferences, favorites, content, auth });

export function makeStore(preloadedState?: ReturnType<typeof rootReducer>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
