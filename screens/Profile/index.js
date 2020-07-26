import React, { PureComponent } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { WaveIndicator } from "react-native-indicators";
import InstagramLogin from "react-native-instagram-login";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actions from "../../app/actions";

import OnLayout from "../../components/OnLayout";
import config from "../../config";

export class Profile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      picture: "",
      interests: [],
      instaLogged: true,
      loading: true
    };
  }

  handleInterestsPress(i) {
    let { login, addInterest, removeInterest } = this.props;
    let { user } = login;

    let hasInt = user.interests.find(c => c.id === i.id);

    if (hasInt) {
      removeInterest(i);
    } else {
      addInterest(i);
    }

    this.updateInterestToView();
  }

  renderInterests() {
    let { user } = this.props.login;

    if (this.state.interests.length <= 0) {
      return null;
    }

    let i = this.state.interests.map(i => {
      let hasInt = user.interests.find(c => c.id === i.id);

      let bgColor = hasInt ? "red" : "#cccccc";

      return (
        <Text
          onPress={() => this.handleInterestsPress(i)}
          key={i.name}
          style={{
            backgroundColor: bgColor,
            color: "white",
            borderRadius: 10,
            padding: 3,
            paddingHorizontal: 10,
            marginHorizontal: 2,
            height: 25
          }}
        >
          {i.name}
        </Text>
      );
    });

    return <ScrollView style={{ height: 150 }}>{i}</ScrollView>;
  }

  handleCategoryPress(i) {
    let { login, addInterest, removeInterests } = this.props;
    let { user } = login;

    let toRemove = user.interests.filter(c => c.categoryId === i.id);

    if (toRemove.length) {
      removeInterests(toRemove);
    } else {
      removeInterests(
        user.interests.filter(c => c.categoryId !== i.id && c.fake)
      );

      addInterest({ categoryId: i.id, fake: true });
    }

    this.updateInterestToView();
  }

  renderCategories() {
    let { user, categories } = this.props.login;

    let toReturn = categories.map(i => {
      let hasCat = user.interests.find(c => c.categoryId === i.id);

      let bgColor = hasCat ? "red" : "#cccccc";

      return (
        <Text
          onPress={() => this.handleCategoryPress(i)}
          key={i.name}
          style={{
            backgroundColor: bgColor,
            color: "white",
            borderRadius: 10,
            padding: 3,
            paddingHorizontal: 10,
            marginHorizontal: 2,
            height: 25
          }}
        >
          {i.name}
        </Text>
      );
    });
    return <ScrollView style={{ height: 150 }}>{toReturn}</ScrollView>;
  }

  renderViewImage(width, height) {
    let imageData = {
      uri:
        "data:image/png;base64,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"
    };
    let images = [
      { id: 1, src: imageData },
      { id: 2, src: imageData },
      { id: 3, src: imageData },
      { id: 4, src: imageData },
      { id: 5, src: imageData },
      { id: 6, src: imageData },
      { id: 7, src: imageData },
      { id: 8, src: imageData },
      { id: 9, src: imageData }
    ];

    let imgRadius = (width - 60) / 3 - 4;
    let toReturn = [];

    for (let index = 0; index < images.length; index = index + 6) {
      let imgsLine1 = [];
      let imgsLine2 = [];
      for (let index2 = 0; index2 < 3; index2++) {
        const img = images[index + index2];
        if (!img) {
          imgsLine1.push(null);
        } else {
          imgsLine1.push(
            <Image
              style={{ width: imgRadius, height: imgRadius, margin: 2 }}
              source={img.src}
            />
          );
        }
      }
      for (let index2 = 3; index2 < 6; index2++) {
        const img = images[index + index2];
        if (!img) {
          imgsLine2.push(null);
        } else {
          imgsLine2.push(
            <Image
              style={{ width: imgRadius, height: imgRadius, margin: 2 }}
              source={img.src}
            />
          );
        }
      }

      toReturn.push(
        <View key={index} style={{ width }}>
          <View style={{ flexDirection: "row", height: imgRadius + 4 }}>
            {imgsLine1}
          </View>
          <View style={{ flexDirection: "row", height: imgRadius + 4 }}>
            {imgsLine2}
          </View>
        </View>
      );
    }

    return toReturn;
  }

  componentWillMount() {
    this.updateInterestToView();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 100);
  }

  updateInterestToView() {
    let { user, categories, interests } = this.props.login;
    var interestsToRender = [];

    for (const category of categories) {
      if (user.interests.find(c => c.categoryId === category.id)) {
        interestsToRender.push(
          ...interests.filter(c => c.categoryId === category.id)
        );
      }
    }

    this.setState({ interests: interestsToRender });
  }

  render() {
    let { user } = this.props.login;
    let { loading, selectedCategories, instaLogged } = this.state;

    if (loading) {
      return (
        <View style={{ flex: 1 }}>
          <WaveIndicator color="#66B2FF" />
        </View>
      );
    }

    if (!user) {
      return <View />;
    }

    return (
      <OnLayout style={{ flex: 1, backgroundColor: "gray" }}>
        {({ width, height }) => (
          <ScrollView style={{ height, width, paddingHorizontal: 30 }}>
            <View style={{ alignItems: "center", marginTop: 45 }}>
              <Image
                style={{ width: 140, height: 140, borderRadius: 70 }}
                resizeMode="cover"
                source={{
                  uri: user.picture
                }}
              />
              <Text>{user.name}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                margin: 10
              }}
            >
              <Text
                style={{
                  backgroundColor: user.gender === "male" ? "red" : "#cccccc",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 15,
                  color: "white"
                }}
              >
                Masculino
              </Text>
              <Text
                style={{
                  backgroundColor: user.gender === "male" ? "#cccccc" : "red",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 15,
                  color: "white"
                }}
              >
                Feminimo
              </Text>
            </View>

            <Text>Preferência:</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                margin: 10
              }}
            >
              <Text
                style={{
                  backgroundColor: user.gender === "female" ? "red" : "#cccccc",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 15,
                  color: "white"
                }}
              >
                Masculino
              </Text>
              <Text
                style={{
                  backgroundColor: user.gender === "female" ? "#cccccc" : "red",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 15,
                  color: "white"
                }}
              >
                Feminimo
              </Text>
            </View>

            <View>
              <Text>Interesses:</Text>

              {this.renderCategories()}

              {this.renderInterests()}
            </View>
            <Text style={{ marginTop: 10 }}>Fotinhos Insta:</Text>
            {instaLogged ? (
              <ScrollView horizontal style={{ paddingVertical: 10 }}>
                {this.renderViewImage(width, height)}
              </ScrollView>
            ) : (
              <View>
                <TouchableOpacity onPress={() => this.insta.show()}>
                  <Text style={{ color: "black" }}>Login</Text>
                </TouchableOpacity>
                <InstagramLogin
                  ref={ref => (this.insta = ref)}
                  clientId="4c15d3162bbe487fa72529137be5d9a1"
                  scopes={["public_content"]}
                  onLoginSuccess={token => this.setState({ token })}
                  onLoginFailure={data => console.log(data)}
                />
              </View>
            )}
          </ScrollView>
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
