import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./userSlice";
import otherReducer from "./otherSlice";

const appStore = configureStore({
  reducer: {
    user: userDetailsReducer,
    other: otherReducer
  },
});

export default appStore;