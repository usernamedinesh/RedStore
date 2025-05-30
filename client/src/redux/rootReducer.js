import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/auth/authSlice";
import storage from "redux-persist/lib/storage";

const rootPersistConfig = {
   key: "root",
   storage,
   keyPrefix: "redux-",
};


const rootReducer = combineReducers({
  auth: authReducer,
  // product: produtReducer,
  // add here
});

export {rootReducer, rootPersistConfig};
