import { combineReducers } from "redux";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import config from "../../config";

import {
  LOGIN,
  LOGIN_SUCCESS,
  ADD_INTEREST_SUCCESS,
  REMOVE_INTEREST_SUCCESS,
  REMOVE_INTERESTS_SUCCESS,
  GET_NEAR_USERS_SUCCESS
} from "../constants";

// Connect our store to the reducers
const initialState = {
  user: null,
  token: null,
  loading: false,
  categories: config.categories,
  interests: config.interests
};

const initialDataState = {
  users: null
};

const loginReducer = (state = initialState, action) => {
  let { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        loading: false
      };
    case LOGIN:
      return { ...state, loading: true };
    case ADD_INTEREST_SUCCESS: {
      let { user } = state;

      user.interests.push(payload);

      return { ...state, user };
    }
    case REMOVE_INTEREST_SUCCESS: {
      let { user } = state;

      user.interests = user.interests.filter(c => c.id !== payload.id);

      return { ...state, user };
    }
    case REMOVE_INTERESTS_SUCCESS: {
      let { user } = state;

      for (const i of payload) {
        user.interests = user.interests.filter(c => c.id !== i.id);
      }

      return { ...state, user };
    }
    default:
      return state;
  }
};

const dataReducer = (state = initialDataState, action) => {
  let { type, payload } = action;
  switch (type) {
    case GET_NEAR_USERS_SUCCESS:
      return {
        ...state,
        users: payload
      };
    default:
      return state;
  }
};

// Combine all the reducers
export const rootReducer = combineReducers({
  login: loginReducer,
  data: dataReducer
});

export default createStore(rootReducer, applyMiddleware(thunk));
