import React, { PureComponent } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight
} from "react-native";

export class Card extends PureComponent {
  render() {
    let {
      text,
      imagePath,
      age,
      cardWidth,
      margin,
      padding,
      onPress,
      distance
    } = this.props;
    let { width } = Dimensions.get("window");
    let cardSize = width / 2;
    return (
      <View
        onPress={onPress}
        style={{
          flex: 1,
          width: cardWidth ? cardWidth : cardSize,
          height: cardSize,
          justifyContent: "flex-end",
          margin: margin !== undefined ? margin : 2,
          padding: padding !== undefined ? padding : 1
        }}
      >
        <TouchableHighlight
          onPress={onPress}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            borderRadius: 5
          }}
        >
          <Image
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 5
            }}
            source={imagePath}
            resizeMode="cover"
          />
        </TouchableHighlight>

        <View
          onPress={onPress}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: 2,
            paddingHorizontal: 3,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <Text
            onPress={onPress}
            style={{
              color: "white"
            }}
          >{`${text}, ${age}`}</Text>
          {distance ? (
            distance >= 1 ? (
              <Text
                style={{
                  color: "white"
                }}
              >
                {distance.toFixed(2)}km
              </Text>
            ) : (
              <Text
                style={{
                  color: "white"
                }}
              >
                {distance}m
              </Text>
            )
          ) : null}
        </View>
      </View>
    );
  }
}

export default Card;
