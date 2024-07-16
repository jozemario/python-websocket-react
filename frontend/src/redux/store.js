import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import authReducer from './authReducer';
import messageReducer from './messageReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  messages: messageReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;