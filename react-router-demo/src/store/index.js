import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux"; 
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
import counterReducer from './counterSlice'

const reducers = combineReducers({
  counter: counterReducer,        
 });
 
const persistConfig = {
  key: 'root',
  storage,
  blacklist: []
};
 
const persistedReducer = persistReducer(persistConfig, reducers);
 
const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
 });
 
export default store;
