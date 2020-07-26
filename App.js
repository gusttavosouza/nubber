import React from "react";

import { Provider } from "react-redux";

import store from "./app/reducers"; //Import the store
import Root from "./screens";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
