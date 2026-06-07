import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./userSlice";
import otherReducer from "./otherSlice";

const appStore = configureStore({
  reducer: {
    userDetails: userDetailsReducer,
    other: otherReducer
  },
});

export default appStore;