import React, { PureComponent } from 'react'
import { View , Dimensions} from 'react-native'

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export class ViewContainer extends PureComponent {
  render() {

    let {height} = Dimensions.get("window");
    height-=24;

    return (

    <KeyboardAwareScrollView  enableOnAndroid enableAutomaticScroll keyboardShouldPersistTaps="handled">
        <View style={{flex:1, flexDirection:"row",height}}>
            <View style={{flex:1}}>
            </View>
            {this.props.children}
            <View style={{flex:1}}>
            </View>
        </View>
    </KeyboardAwareScrollView>
    )
  }
}

export default ViewContainer