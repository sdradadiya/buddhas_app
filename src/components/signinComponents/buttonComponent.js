import React from 'react';
import { Dimensions, Text, View, TouchableHighlight,TextInput , Alert, AsyncStorage,Keyboard} from 'react-native';
import font from '../../helper/fontsize';
import Constant from '../../helper/constants';

export default class ButtonComponent extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (

      <View style={{justifyContent:'center', alignItems:'center'}}>
        <TouchableHighlight style = {[{
          borderColor:'rgba(116,196,248,1)',
          borderWidth:1,
          justifyContent:'center',
          width:Constant.screenWidth-100,
          alignItems:'center',
          marginBottom: 25,
          paddingTop:7,
          paddingBottom:7
        },(this.props.otherStyle)?this.props.otherStyle:{}]}

                            underlayColor='transparent' onPress={() => {
                              Keyboard.dismiss()
                              this.props.nextClicked()
        }}>

          <Text style = {[{    color: 'black',
            padding:5,
            fontFamily:Constant.fontNotoR
          }, font.TEXTBOX_FONT]}>{this.props.title}
          </Text>
        </TouchableHighlight>

      </View>
    )
  }
}
