import React from 'react';
import { Dimensions, Text, View, TouchableHighlight,TextInput , Alert, AsyncStorage,Keyboard,Platform} from 'react-native';
import font from '../../helper/fontsize';
import cs from '../../helper/customStyles';
import * as actions from '../../actions'
import strings from '../../helper/language';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import Constant from '../../helper/constants';

class ConfirmPasswordComponent extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    if(this.props.isBack){
      this.refs.view.bounceInLeft(1000);
    }
  }

  render() {
    return (
      <Animatable.View ref="view">
        <TextInput style = {[font.TEXTBOX_FONT,{    width:Constant.screenWidth-100,
          height: (Platform.OS === 'android') ? 40 : 30,
          borderBottomColor: 'rgba(116,196,248,1)',
          borderBottomWidth: 1,
          margin: (Platform.OS === 'android') ? 15 : 20,
          fontFamily:Constant.fontNotoR
        }]}
                   ref="email"
                   returnKeyType={"done"}
                   blurOnSubmit={true}
                   underlineColorAndroid = "transparent"
                   placeholder = {strings.confirmpassword}
                   autoCapitalize = "none"
                   autoCorrect={false}
                   value={this.props.confirmPassword}
                   secureTextEntry
                   onChangeText={(text) => {this.props.userLoginUpdate({ prop: 'confirmPassword', value: text});}}
        />
      </Animatable.View>
    )
  }
}
mapStateToProps = state => {
  const {confirmPassword} = state.userLoginForm;
  return {
    confirmPassword
  }
};

export default connect(mapStateToProps, actions)(ConfirmPasswordComponent);