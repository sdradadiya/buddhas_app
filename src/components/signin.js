import React, {Component} from 'react';
import {StyleSheet,ScrollView, Alert, View, Text, TouchableHighlight, Image, Dimensions, TextInput, Platform} from 'react-native';
import {connect, } from 'react-redux';
import font from '../helper/fontsize';
import * as actions from '../actions'
import Constant from '../helper/constants';
import Router from '../navigationHelper/Router'
import strings from '../helper/language';
import { Icon, } from "react-native-elements";
import {showAlert} from '../helper/commonFunctions'
import Spinner from './loader'


import Email from './signinComponents/EmailComponent'
import Password from './signinComponents/password'
import Create from './signinComponents/createPassword'
import Confirm from './signinComponents/confirmPassword'
import Forgot from './signinComponents/forgotPassword'
import Button from './signinComponents/buttonComponent'

const {height, width} = Dimensions.get('window');
const EMAIL = 'Email';
const CREATE_PASSWORD = 'Create Password';
const CONFIRM_PASSWORD = 'Confirm Password';
const FORGOT_PASSWORD = 'Forgot Password';
const PASSWORD = 'Password';

class Signin extends Component {
  static navigationOptions = {
    header:null

  };
  constructor(props){
    super(props);
debugger
    this.state = {
      currentComponent: EMAIL,
      isBack: false,
          isLoading:false
      }
  }
  validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  goBack = () => {
    switch (this.state.currentComponent){
      case EMAIL:
        this.props.navigator.pop()
        break;
      case PASSWORD:
        this.setState({
          currentComponent: EMAIL,
          isBack:true,
        });
        break;
      case CREATE_PASSWORD:
        this.setState({
          currentComponent: EMAIL,
          isBack:true,
        });
        break;
      case CONFIRM_PASSWORD:
        this.setState({
          currentComponent: CREATE_PASSWORD,
          isBack:true,
        });
        break;
      case FORGOT_PASSWORD:
        this.setState({
          currentComponent: PASSWORD,
          isBack:true,
        });
        break;
      default:
        this.setState({
          currentComponent: EMAIL,
          isBack:true,
        });
        break
    }
  };

  renderComponent = () => {
    switch (this.state.currentComponent){
      case PASSWORD:
        return (
          <View style={styles.contentView}>
            <View>
            <Password/>
            <TouchableHighlight onPress={() => this.onforgotTextClicked()} underlayColor='transparent'>
              <Text style = {[font.TEXTBOX_FONT,styles.forgotPass]}>{strings.forgot}</Text>
            </TouchableHighlight>
            </View>
            <Button title={strings.signin} nextClicked={this.onPasswordPressed}/>
          </View>
        );
      case CREATE_PASSWORD:
        return (
          <View style={styles.contentView}>
            <Create/>
            <Button title={strings.signin} nextClicked={this.onCreatePasswordPressed}/>
          </View>
        );
      case CONFIRM_PASSWORD:
        return (
          <View style={styles.contentView}>
            <Confirm/>
            <Button title={strings.signin} nextClicked={this.onConfirmPasswordPressed}/>
          </View>
        );
      case FORGOT_PASSWORD:
        return (
          <View style={styles.contentView}>
            <Forgot/>
            <Button title={strings.signin} nextClicked={this.onforgotPasswordPressed}/>
          </View>
        );
      default:
        return (
          <View style={styles.contentView}>
            <Email/>
            <Button title={strings.signin} nextClicked={this.onEmailPressed}/>
          </View>
        )
    }
  };

  onEmailPressed = () => {
    if (this.props.email) {
      if(this.props.email.trim().length <= 0)
      {
        showAlert('Enter Email Address');
      }
      else if (!this.validateEmail(this.props.email.trim())) {
        showAlert('Enter valid Email Address');
      } else {
        this.setState({
          isLoading:true
        })
        this.props.checkMail(this.props.email.trim()).then((res) => {
          this.setState({
            isLoading:false
          })
          if(!res.isChangePassword){
            this.setState({
              currentComponent: CREATE_PASSWORD,
              isBack: false,
            })
          }else {
            this.setState({
              currentComponent: PASSWORD,
              isBack: false,
            })
          }
        }).catch((err) => {

          this.setState({
            isLoading:false
          })

          if (typeof err === 'string'){
            showAlert(err);
          }else{
            showAlert("Network Error");
          }
        })
      }
    }else{
      showAlert('Enter Email Address');
    }
  }
  onPasswordPressed = () => {
    this.onLoginSet()
  }
  onLoginSet = () => {

    const {email, password} = this.props;

    if (email && password) {

      if (password.length <= 0) {
        showAlert('Enter Password');
      }
      else{
        this.setState({
          isLoading:true
        })

        this.props.userLogin(email, password, true).then((res) => {
          this.setState({
            isLoading:false
          })
          this.props.navigator.push(Router.getRoute('mainscreen'))

        }).catch((err) => {
debugger
          this.setState({
            isLoading:false
          })
          if (typeof err.message === 'string'){
            showAlert(err.message);
          }else{
            showAlert("Network Error");
          }
        });
      }
    }
    else {
      showAlert('Enter Proper Data.');
    }
  };



  onforgotPasswordPressed = () => {
    debugger
    if (this.props.email) {

      if (this.props.email.trim().length <= 0) {
        showAlert('Enter Email Address.');
      }
      else if (!this.validateEmail(this.props.email.trim())) {
        showAlert('Enter valid Email Address');
      }
      else {
          this.setState({
              isLoading:true
          })
        this.props.forgotPassword(this.props.email.trim()).then((res) => {
          debugger
            showAlert('Password has been sent to your email Address.Please check.');
            this.setState({
                currentComponent: PASSWORD,
                isBack: false,
                isLoading:false
            })
        }).catch((err) => {
          debugger
            this.setState({
                isLoading:false
            })
            showAlert('Failed to send Email, please try again.');

        })
        // this.props.showLoadingIndicator(true);
        // this.props.setNewPassword(this.props.email.trim())
      }
    }else {
      showAlert('Enter Email Address.');
    }

  };

  onforgotTextClicked = () => {
      this.props.userLoginUpdate({ prop: 'email', value: ''})
      this.props.userLoginUpdate({ prop: 'password', value: ''})
    this.setState({
      currentComponent: FORGOT_PASSWORD,
      isBack:false,
    })
  };

  onCreatePasswordPressed = () => {
    if(this.props.createPassword){
      if (this.props.createPassword.trim().length <= 0) {
        showAlert('Enter New Password');
      }
      else{
        this.setState({
          currentComponent: CONFIRM_PASSWORD,
          isBack:false,
        })
      }

    }else{
      showAlert('Enter New Password');
    }
  };
  onConfirmPasswordPressed = () => {
    if(this.props.confirmPassword){
      if (this.props.confirmPassword.trim().length <= 0) {
        showAlert('Enter Confirm Password');
      }
      else {
        if (this.props.createPassword === this.props.confirmPassword) {
          this.setState({
            isLoading:true
          })
          this.props.userLogin(this.props.email, this.props.confirmPassword, false).then((res) => {
            this.setState({
              isLoading:false
            })

            this.props.navigator.push(Router.getRoute('mainscreen'))

          }).catch((err) => {
            this.setState({
              isLoading:false
            })
debugger
            if (typeof err === 'string'){
              showAlert(err);
            }else{
              showAlert("Network Error");
            }

          });

        }else{
          showAlert("password must match confirm password.");
        }
      }
    }else{
      showAlert('Enter Confirm Password');
    }

  };

  render() {
    return (
      <View style={styles.mainView}>
          <View style={{flexDirection:'row', marginTop:Platform.OS === 'android' ? 0 :15}}>
            <Icon name="navigate-before" color="black" size={35} onPress={() => {this.goBack()}} />
          </View>

          <View style={[styles.titleView,]}>
            <Image source={require('../../images/titleImage.png')}
                   style={{width:Constant.screenWidth/2}}
                   resizeMode='contain'/>
          </View>

        {
          this.renderComponent()
        }

        <Spinner visible={this.state.isLoading}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection:'column',
    flex:1
  },
  titleView:{
    justifyContent:'center',
    alignItems:'center',
    flex:3,
    flexDirection:'column'
  },
  contentView: {
    flex:6,
    alignItems:'center',
    justifyContent:'space-between',
    width,
  },
  titleText: {
    alignSelf:'center',
    margin:2,
    color:'#000',
    fontFamily:Constant.fontNotoR

  },
  input: {
    width:width-100,
    height: (Platform.OS === 'android') ? 40 : 30,
    borderBottomColor: 'rgba(116,196,248,1)',
    borderBottomWidth: 1,
    margin: (Platform.OS === 'android') ? 15 : 20,
    fontFamily:Constant.fontNotoR
  },
  forgotPass:{
    color:'#000',
    width:width-100,
    height: (Platform.OS === 'android') ? 40 : 30,
    margin: (Platform.OS === 'android') ? 15 : 20,
    alignItems:'center',
    justifyContent:'center',
    fontFamily:Constant.fontNotoR,
    textAlign: 'center'
  },
});

mapStateToProps = state => {
  const {email, password, createPassword, confirmPassword} = state.userLoginForm;
  return {
    email, password, createPassword, confirmPassword
  }
};

export default connect(mapStateToProps, actions)(Signin);

/*                  <TextInput style = {[font.TEXTBOX_FONT,styles.input]}
                             underlineColorAndroid = "transparent"
                             ref="password"
                             returnKeyType={"done"}
                             placeholder = {strings.password}
                             secureTextEntry
                             autoCorrect={false}
                             autoCapitalize = "none"
                             value={this.props.password}
                             onChangeText={(text) => {this.props.userLoginUpdate({ prop: 'password', value: text});}}
                  />

                  <TouchableHighlight onPress={() => alert('h')} underlayColor='transparent'>
                      <Text style = {[font.TEXTBOX_FONT,styles.forgotPass]}>{strings.forgot}</Text>
                  </TouchableHighlight>
*/