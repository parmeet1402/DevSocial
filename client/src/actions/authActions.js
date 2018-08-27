import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
//action creator
// register user
export const registerUser = (userData, history) => dispatch => {
  // userData is a new user data sent from Register.js file
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//login --get user token
export const loginUser = userData => dispatch => {
  // userData is a new user data sent from Register.js file
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // save to localstorage
      const { token } = res.data;
      //set token to localstorage
      localStorage.setItem("jwtToken", token);
      //set token to auth header
      setAuthToken(token);
      //decode token to get user data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//logout user
export const logoutUser = () => dispatch => {
  //remove token from local storage
  localStorage.removeItem("jwtToken");
  //remove auth header for future requests
  setAuthToken(false);
  //set current usrt to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

//set logged in user
//set current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
