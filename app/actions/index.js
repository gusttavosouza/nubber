import {
  LOGIN,
  LOGIN_SUCCESS,
  ADD_INTEREST_SUCCESS,
  REMOVE_INTEREST_SUCCESS,
  REMOVE_INTERESTS_SUCCESS,
  GET_NEAR_USERS_SUCCESS
} from "../constants";

import config from "../../config";

export function getNearUsers(location) {
  return (dispatch, getState) => {
    let login = getState().login;

    let { user } = login;

    var usersList = [];

    if (user.gender === "male") {
      usersList = config.users.filter(c => c.genre === "F");
    } else {
      usersList = config.users.filter(c => c.genre === "M");
    }

    let users = usersList.sort(c => c.distance - c.distance);

    dispatch({ type: GET_NEAR_USERS_SUCCESS, payload: users.slice(0, 10) });
  };
}

export function addInterest(interest) {
  return dispatch => {
    dispatch({ type: ADD_INTEREST_SUCCESS, payload: interest });
  };
}

export function removeInterest(interest) {
  return dispatch => {
    dispatch({ type: REMOVE_INTEREST_SUCCESS, payload: interest });
  };
}
export function removeInterests(interests) {
  return dispatch => {
    dispatch({ type: REMOVE_INTERESTS_SUCCESS, payload: interests });
  };
}

export function getFBToken(callback) {
  return async dispatch => {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      "2034552750153287",
      {
        permissions: ["public_profile"]
      }
    );

    if (type === "success") {
      dispatch({ type: LOGIN });
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name&access_token=${token}`
      ).catch(e => console.log("Fetch fb user data error: ", e));

      var user = await response.json();

      response = await fetch(
        `https://graph.facebook.com/me/picture?height=400&access_token=${token}`
      ).catch(e => console.log("Fetch fb user pic error: ", e));

      user.picture = response.url;

      response = await fetch(
        "https://genderapi.io/api/?name=" + user.name
      ).catch(e => console.log("Fetch fb user gender error: ", e));

      let json = await response.json();

      user.gender = json.gender;

      user.interests = config.getInterests();

      callback && callback();

      dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
    }
  };
}
