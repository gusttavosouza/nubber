import React, { Component } from 'react'
import { Text, TouchableHighlight } from 'react-native'

const teste = {
  testeTeste: {
      fontSize: 50,
      backgroundColor: '#0000CD',
      top: 0
  }
}

export default class Button extends Component {
  render() {

    let{onPress, text}=this.props

    return (
      <TouchableHighlight {...this.props} style={[{
            height: 50,
            width:"100%",
            borderRadius:5, 
            justifyContent:"center",      
       },this.props.style]}>
        <Text style={[{
            textAlign: "center",
            textAlignVertical: "center",
            fontWeight:"bold",
         },this.props.textStyle]}> {text} </Text>
      </TouchableHighlight>
    )
  }
}