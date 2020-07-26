import React, { Component } from "react";
import { Text, View } from "react-native";

export class BaseScreen extends Component {
  static title = "";
  constructor(title) {
    super();
    this.title = title;
  }

  componentWillMount() {
    this.setTitle();
  }

  setTitle(title) {
    let params = this.props.navigation.state;
    if (params && !params.title) {
      this.props.navigation.setParams({ title: title || this.title });
    }
  }
}

export default BaseScreen;
