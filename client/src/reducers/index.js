import {combineReducers} from 'redux';
import authReducer from './authReducer';

const initialState = {};

export default combineReducers({
    auth: authReducer
});