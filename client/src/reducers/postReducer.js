import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST
} from "../actions/types";

const inititalState = {
  post: [],
  posts: [],
  loading: false
};

export default function(state = inititalState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };

    default:
      return state;
  }
}
