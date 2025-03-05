import { configureStore } from "@reduxjs/toolkit";
import toastSliceReducer from "./slice/toastSlice";

const store = configureStore({
  reducer: {
    toast: toastSliceReducer,
  }
});

export default store;