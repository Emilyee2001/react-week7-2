import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: []
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action){
      const id = new Date().getTime();
      const {text, status} = action.payload;
      state.messages = [{
        id,
        text,
        status
      }];
    },
    removeToast(state, action) {
      const id = action.payload;
      const index = state.messages.findIndex(message => message.id === id);
      index !== -1 && state.messages.splice(index, 1);
    },
  }
})

export const { showToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;