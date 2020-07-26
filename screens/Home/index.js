import React from "react";
import { Text, StyleSheet, View, ListView, Platform } from "react-native";
import { WaveIndicator } from "react-native-indicators";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Constants, Location, Permissions } from "expo";

import * as actions from "../../app/actions";

import BaseScreen from "../BaseScreen";
import ViewContainer from "../../components/ViewContainer";
import Card from "../../components/Card";
import Button from "../../components/Button";
import config from "../../config";

const logo = {
  uri:
    "http://www.lance.com.br/files/main_gallery/uploads/2016/05/11/573343a4b8999.jpeg"
};

export class Home extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      choosedUser: null
    };
  }

  renderRow({ user1, user2 }) {
    return (
      <View style={{ flexDirection: "row" }}>
        {user1 ? (
          <Card
            text={user1.name}
            age={user1.age}
            imagePath={{ uri: user1.URL }}
          />
        ) : (
          <View
            style={{
              flex: 1
            }}
          />
        )}
        {user2 ? (
          <Card
            text={user2.name}
            age={user2.age}
            imagePath={{ uri: user2.URL }}
          />
        ) : (
          <View
            style={{
              flex: 1
            }}
          />
        )}
      </View>
    );
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  async getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });

      this.props.getNearUsers();
    } else {
      var locationOk = false;
      setTimeout(() => {
        if (!locationOk) {
          this.props.getNearUsers({});
        }
      }, 5000);
      let location = await Location.getCurrentPositionAsync({
        timeInterval: 2000,
        enableHighAccuracy: true
      }).catch(e => console.log("GetLocationError: ", e));

      locationOk = true;
      this.props.getNearUsers(location);
    }
  }

  componentWillMount() {
    this.getLocationAsync();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 10);
  }

  handleAccept() {
    let { choosedUser } = this.state;

    choosedUser.accept = true;
    choosedUser.reject = false;

    this.props.navigation.navigate("Chat", { user: choosedUser });

    this.setState({ choosedUser: null });
  }

  search() {
    let { data, login } = this.props;

    let { users } = data;
    let { user } = login;

    users = [...users];

    for (const u of users) {
      let commons = u.interests.filter(c =>
        user.interests.find(i => i.id === c.id)
      );

      u.commonRate = commons.length;
    }

    users = users
      .sort((a, b) => a.commonRate - b.commonRate)
      .filter(c => !c.accept && !c.reject);

    let mostMatch = users[0];

    this.setState({
      choosedUser: mostMatch
    });
  }

  handleReject() {
    let { choosedUser } = this.state;

    choosedUser.reject = true;
    choosedUser.accept = false;

    this.setState({ choosedUser: null });
  }

  render() {
    let { loading, choosedUser } = this.state;
    let { users } = this.props.data;

    if (loading || !users) {
      return (
        <View style={{ flex: 1 }}>
          <WaveIndicator color="#66B2FF" />
        </View>
      );
    }

    var usersList = [];

    for (let index = 0; index < users.length; index += 2) {
      let user1 = users[index];
      let user2 = users[index + 1];

      usersList.push({
        user1,
        user2
      });
    }

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return (
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <ListView
          dataSource={ds.cloneWithRows(usersList)}
          renderRow={this.renderRow.bind(this)}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <View style={{ padding: 20 }}>
          <Button
            text="GO GO GO"
            style={{ backgroundColor: "#66B2FF" }}
            textStyle={{ color: "white" }}
            onPress={this.search.bind(this)}
          />
        </View>
        {choosedUser ? (
          <View
            onPress={this.handleReject.bind(this)}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0
            }}
          >
            <View
              onPress={this.handleReject.bind(this)}
              style={{
                position: "absolute",
                top: "25%",
                bottom: "25%",
                left: "5%",
                right: "5%",
                padding: 10,
                borderRadius: 5
              }}
            >
              <Card
                onPress={this.handleReject.bind(this)}
                cardWidth="100%"
                margin={0}
                padding={0}
                distance={choosedUser.distance}
                text={choosedUser.name}
                age={choosedUser.age}
                imagePath={{ uri: choosedUser.URL }}
              />
              <Button
                onPress={this.handleAccept.bind(this)}
                text="TOPPER"
                style={{ backgroundColor: "#66B2FF", marginTop: 10 }}
                textStyle={{ color: "white" }}
              />
              <View
                onPress={this.handleReject.bind(this)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "black",
                  borderRadius: 10,
                  height: 20,
                  width: 20
                }}
              >
                <Text
                  style={{ color: "white", textAlign: "center" }}
                  onPress={this.handleReject.bind(this)}
                >
                  X
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps({ login, data }, props) {
  return {
    login,
    data
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

const styles = StyleSheet.create({});
