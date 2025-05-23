import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  // product: produtReducer,
  // add here
});

export default rootReducer;
