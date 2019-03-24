import React from 'react';
import { Dimensions, Text, View, TouchableHighlight,TextInput , Alert, AsyncStorage,Keyboard,Platform} from 'react-native';
import font from '../../helper/fontsize';
import cs from '../../helper/customStyles';
import * as actions from '../../actions'
import strings from '../../helper/language';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import Constant from '../../helper/constants';

class EmailComponent extends React.Component {

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
                   keyboardType={'email-address'}
                   underlineColorAndroid = "transparent"
                   placeholder = {strings.email}
                   autoCapitalize = "none"
                   autoCorrect={false}
                   value={this.props.email}
                   onChangeText={(text) => {this.props.userLoginUpdate({ prop: 'email', value: text});}}
        />
        <Text style={{fontFamily:Constant.fontNotoR, color:'black', textAlign: 'center'}}>{strings.forgotText}</Text>
      </Animatable.View>
    )
  }
}
mapStateToProps = state => {
  const {email} = state.userLoginForm;
  return {
    email
  }
};

export default connect(mapStateToProps, actions)(EmailComponent);