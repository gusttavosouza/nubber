import React, { Component } from "react";
import { Image, View, Alert, Text, TextInput } from "react-native";
import { WaveIndicator } from "react-native-indicators";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actions from "../../app/actions";

import styles from "./styles";

import BaseScreen from "../BaseScreen";
import Button from "../../components/Button";
import ViewContainer from "../../components/ViewContainer";

const logo = require("../../img/logo.png");

export class Login extends BaseScreen {
  constructor(props) {
    super("Login");

    this.state = {
      loading: true
    };
  }

  async onFbPress() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.props.navigation.navigate("Home");
    }, 100);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1500);
  }

  render() {
    let { getFBToken, login } = this.props;

    if (this.state.loading || login.loading) {
      return (
        <View style={{ flex: 1 }}>
          <WaveIndicator color="#66B2FF" />
        </View>
      );
    }

    let { container } = styles;
    return (
      <ViewContainer>
        <View style={{ flex: 5, justifyContent: "space-around" }}>
          <View style={{ flex: 1 }} />
          <Image
            source={logo}
            resizeMode="contain"
            style={{ flex: 2, width: "100%" }}
          />
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1 }}>
            <Button
              text="Login with Facebook"
              style={{ backgroundColor: "#3B5998" }}
              textStyle={{ color: "white" }}
              onPress={() => getFBToken(this.onFbPress.bind(this))}
            />
          </View>
        </View>
      </ViewContainer>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    login: state.login
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

//Connect everything
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
