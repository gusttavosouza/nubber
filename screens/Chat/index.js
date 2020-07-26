import React, { Component } from "react";
import { Text, View, Image, FlatList, TextInput, Keyboard } from "react-native";
import IconMI from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import Button from "../../components/Button";
import OnLayout from "../../components/OnLayout";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatAccepted: false,
      messages: [],
      KeyboardHeight: 0,
      message: ""
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    this.setState({ KeyboardHeight: e.endCoordinates.height });
  }

  _keyboardDidHide() {
    this.setState({ KeyboardHeight: 0 });
  }

  sendMessage() {
    let { message, messages, chatAccepted } = this.state;

    messages.push({ message: message, from: 0, id: messages.length + 1 });
    message = "";
    this.setState({
      message,
      messages
    });

    this.listView.scrollToEnd();

    if (chatAccepted) return;

    setTimeout(() => {
      messages.push({ message: "Olá", from: 1, id: messages.length + 1 });
      this.setState({
        chatAccepted: true,
        messages
      });
    }, 1000);
  }

  renderChatItem({ item }) {
    let { user } = this.props.login;
    let backgroundColor = null;

    if (user.gender === "male") {
      backgroundColor = item.from ? "#DDA0DD" : "#90CAF9";
    } else {
      backgroundColor = item.from ? "#90CAF9" : "#DDA0DD";
    }

    return (
      <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
        <Text
          style={{
            backgroundColor,
            padding: 10,
            color: "#696969",
            fontSize: 16,
            fontWeight: "bold",
            marginLeft: item.from ? 0 : 45,
            marginRight: item.from ? 45 : 0,
            borderRadius: 20
          }}
        >
          {item.message.toString()}
        </Text>
      </View>
    );
  }

  handleInputChange(message) {
    this.setState({
      message
    });
  }

  render() {
    let { navigation } = this.props;
    let { state, goBack } = navigation;
    let { user } = state.params;
    let { KeyboardHeight, chatAccepted, messages, message } = this.state;
    //let myUser = this.props.login.user;

    let myUser = this.props.login.user;
    return (
      <OnLayout style={{ flex: 1 }}>
        {({ width, height }) => (
          <KeyboardAwareScrollView
            style={{ backgroundColor: "#0b0c22" }}
            enableOnAndroid
            enableAutomaticScroll
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="always"
            ref={ref => (this.scrollView = ref)}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: 24,
                paddingHorizontal: 10,
                height: 60,
                alignItems: "center",
                backgroundColor:
                  myUser.gender === "male" ? "#66B2FF" : "#EE82EE"
              }}
            >
              <IconMI
                name="arrow-back"
                size={25}
                color="white"
                onPress={() => goBack()}
              />
              <Image
                source={{ uri: user.URL }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginHorizontal: 10
                }}
              />
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
              >
                {user.name}{" "}
                {chatAccepted ? null : (
                  <Text style={{ fontSize: 12 }}>- (pending...)</Text>
                )}
              </Text>
            </View>

            <FlatList
              style={{
                height: height - 120 - KeyboardHeight - 10,
                backgroundColor: "#dcdcdc"
              }}
              data={messages}
              keyExtractor={(item, index) => item.id + ""}
              renderItem={this.renderChatItem.bind(this)}
              ref={ref => (this.listView = ref)}
            />

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#c1c1c1",
                height: 50
              }}
            >
              <TextInput
                editable={chatAccepted || !messages.length}
                value={message}
                placeholder={
                  chatAccepted || !messages.length
                    ? "Type a message"
                    : `Waiting for ${user.name} accept your invitation`
                }
                onChangeText={this.handleInputChange.bind(this)}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  paddingHorizontal: 5,
                  width: width - 120
                }}
                returnKeyType="send"
                onSubmitEditing={this.sendMessage.bind(this)}
              />
              {chatAccepted || !messages.length ? (
                <Button
                  disabled={!message}
                  text="Send"
                  style={{ width: 100 }}
                  onPress={this.sendMessage.bind(this)}
                />
              ) : null}
            </View>
          </KeyboardAwareScrollView>
        )}
      </OnLayout>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    login: state.login
  };
}

//function mapDispatchToProps(dispatch) {
//  return bindActionCreators(actions, dispatch);
//}

export default connect(
  mapStateToProps
  //mapDispatchToProps
)(Chat);
