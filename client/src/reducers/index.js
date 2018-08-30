import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducers";
import profileReducer from "./profileReducer";

/* const initialState = {};*/
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer
});
