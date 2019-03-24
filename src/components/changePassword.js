import React, {Component} from 'react';
import {StyleSheet,ScrollView, View, Text, Alert, TouchableHighlight, Image, Dimensions, TextInput, Platform} from 'react-native';
import {connect, } from 'react-redux';
import NavigationBar from './NavigationBar';
import Constant from '../helper/constants';
import font from '../helper/fontsize';
import * as actions from '../actions'
import strings from '../helper/language';
import { Icon, } from "react-native-elements";
import {showAlert} from '../helper/commonFunctions'

const {height, width} = Dimensions.get('window');
import TrackPlayer from 'react-native-track-player'

import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation


class ChangePassword extends Component {
  static navigationOptions = {
    header:null,
  };
    componentWillMount(){
        TrackPlayer.getState().then((state) => {
            if(state === Constant.playingState){
                this.props.showPlayerComponent(true)
            }
        })

    }
    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.isFocused) {
            TrackPlayer.getState().then((state) => {
                if(state === Constant.playingState){
                    this.props.showPlayerComponent(true)
                }
            })
        }
    }

  onPasswordSet = () => {
    const {email, passwordcng, repasswordcng} = this.props;

    if (passwordcng && repasswordcng) {
      if (passwordcng === repasswordcng) {
        this.props.userLogin(email, passwordcng, false).then((res) => {
          alert(this.props.passwordSuccess)
          this.props.navigator.pop()
        }).catch((err) => {
          showAlert(err);
        });
      }
      else {
        showAlert('password must match confirm password.');
      }
    }
    else{
        showAlert('Enter Proper Data.');
    }
  };

  validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };


  backPressed = () => {
    this.props.navigator.pop()
  };

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  render() {

    return (
      <View style={styles.mainView}>

        <NavigationBar
          navTitle={strings.changepass}
          leftButtonPressed = { this.backPressed }
          leftButtonType = {Constant.navButtonType.back} />

        <ScrollView scrollEnabled={false} >
          <View style={styles.contentView}>
            <TextInput style = {[font.TEXTBOX_FONT,styles.input, {marginTop:(Platform.OS === 'android') ? 30 : 40,}]}
                       underlineColorAndroid = "transparent"
                       returnKeyType={"next"}
                       ref="password"
                       onSubmitEditing={() => this.focusNextField('confirm')}
                       placeholder = {strings.newPassword}
                       secureTextEntry
                       autoCorrect={false}
                       autoCapitalize = "none"
                       value={this.props.passwordcng}
                       onChangeText={(text) => {this.props.userPasswordUpdate({ prop: 'passwordcng', value: text});}}
            />

            <TextInput style = {[font.TEXTBOX_FONT,styles.input]}
                       ref="confirm"
                       returnKeyType={"done"}
                       underlineColorAndroid = "transparent"
                       placeholder = {strings.confirmpassword}
                       secureTextEntry
                       autoCorrect={false}
                       autoCapitalize = "none"
                       value={this.props.repasswordcng}
                       onChangeText={(text) => {this.props.userPasswordUpdate({ prop: 'repasswordcng', value: text});}}
            />


          </View>

        <View style={{ alignItems:'center'}}>
            <TouchableHighlight style = {styles.submitButton}
                                underlayColor='transparent' onPress={this.onPasswordSet}>
              <Text ref="register" style = {[styles.submitButtonText, font.TEXTBOX_FONT]}>{strings.update}</Text>
            </TouchableHighlight>
          </View>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    bottom:0,
    flexDirection:'column',
    flex:1,left:0,right:0,top:0,

  },
  titleView:{
    marginTop:0,
    justifyContent:'center',
    width,
    height: height/3.5,
  },
  contentView: {
    flex:1,
    alignItems:'center',
    width,
    flexDirection:'column',
  },
  titleText: {
    alignSelf:'center',
    margin:2,
    color:'#000',
  },
  btnStyle: {
    width: width/2,
    alignItems:'center',
    padding:10
  },
  input: {
    width:width-100,
    height: (Platform.OS === 'android') ? 40 : 30,
    borderBottomColor: 'rgba(116,196,248,1)',
    borderBottomWidth: 1,
    margin: (Platform.OS === 'android') ? 15 : 20,
    fontFamily:Constant.fontNotoR,
  },
  submitButton: {
    borderColor:'rgba(116,196,248,1)',
    borderWidth:1,
    width:width-100,
    alignItems:'center',
    justifyContent:'center',
    margin:(Platform.OS === 'android') ? 15 : 20,
  },

  submitButtonText:{
    color:'#000',
    fontFamily:Constant.fontNotoR,
    padding:5
  }
});

mapStateToProps = state => {
  const {email, passwordcng, repasswordcng, passwordSuccess} = state.userLoginForm;
  return {
    email, passwordcng, repasswordcng, passwordSuccess
  }
};

export default connect(mapStateToProps, actions)(ChangePassword);