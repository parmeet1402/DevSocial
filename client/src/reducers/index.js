import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducers";
import profileReducer from "./profileReducer";
import postReducer from "./postReducer";

/* const initialState = {};*/
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer
});
