import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducers';

const initialState = {};

export default combineReducers({
    auth: authReducer,
    errors: errorReducer
});