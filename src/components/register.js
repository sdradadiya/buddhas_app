import React, {Component} from 'react';
import {StyleSheet,ScrollView, View, Text, Alert, TouchableHighlight, Image, Dimensions, TextInput, Platform} from 'react-native';
import {connect, } from 'react-redux';
import NavigationBar from './NavigationBar';
import Constant from '../helper/constants';
import font from '../helper/fontsize';
import Router from '../navigationHelper/Router';
import * as actions from '../actions'
import strings from '../helper/language';
import { Icon, } from "react-native-elements";
import {showAlert} from '../helper/commonFunctions'
import Spinner from './loader'

const {height, width} = Dimensions.get('window');

class Register extends Component {
  static navigationOptions = {
    header:null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading:false
    };

  }


  onCreateSet = () => {
    const {email, password, repassword, coupon} = this.props;

    if (email && password && repassword) {

      if (!this.validateEmail(this.props.email.trim())) {
        showAlert('Enter valid Email Address');
      }
      else if(password === repassword){
        this.setState({
          isLoading: true
        })
        this.props.userCreates(email, password, repassword, coupon).then((res) => {
          this.setState({
            isLoading: false
          })

          this.props.navigator.push(Router.getRoute('mainscreen'))
        }).catch((err) => {
          debugger
            this.props.userRegisterUpdate({ prop: 'email', value: ''})
            this.props.userRegisterUpdate({ prop: 'password', value: ''})
            this.props.userRegisterUpdate({ prop: 'repassword', value: ''})
          this.setState({
            isLoading: false
          })
          showAlert(err);
        });

      }
      else {
          this.props.userRegisterUpdate({ prop: 'password', value: ''})
          this.props.userRegisterUpdate({ prop: 'repassword', value: ''})
          showAlert('password must match confirm password.');
      }
    }
    else {
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
          <ScrollView scrollEnabled={false} contentContainerStyle={{height:Platform.OS === 'android' ? height-40 : height-20}}>
              <View style={{flexDirection:'row', marginTop:Platform.OS === 'android' ? 0 :15}}>
                  <Icon name="navigate-before" color="black" size={35} onPress={this.backPressed} />
              </View>

              <View style={[styles.titleView,]}>
                <Image source={require('../../images/titleImage.png')}
                       style={{width:Constant.screenWidth/2}}
                       resizeMode='contain'/>
              </View>

              <View style={styles.contentView}>
                  <TextInput style = {[font.TEXTBOX_FONT,styles.input]}
                             ref="email"
                             returnKeyType={"next"}
                             underlineColorAndroid = "transparent"
                             onSubmitEditing={() => this.focusNextField('password')}
                             placeholder = {strings.email}
                             autoCorrect={false}
                             autoCapitalize = "none"
                             value={this.props.email}
                             onChangeText={(text) => {this.props.userRegisterUpdate({ prop: 'email', value: text});}}
                  />


                  <TextInput style = {[font.TEXTBOX_FONT,styles.input]}
                             underlineColorAndroid = "transparent"
                             returnKeyType={"next"}
                             ref="password"
                             onSubmitEditing={() => this.focusNextField('confirm')}
                             placeholder = {strings.password}
                             secureTextEntry
                             autoCorrect={false}
                             autoCapitalize = "none"
                             value={this.props.password}
                             onChangeText={(text) => {this.props.userRegisterUpdate({ prop: 'password', value: text});}}
                  />

                  <TextInput style = {[font.TEXTBOX_FONT,styles.input]}
                             ref="confirm"
                             returnKeyType={"done"}
                             underlineColorAndroid = "transparent"
                             placeholder = {strings.confirmpassword}
                             secureTextEntry
                             autoCorrect={false}
                             autoCapitalize = "none"
                             value={this.props.repassword}
                             onChangeText={(text) => {this.props.userRegisterUpdate({ prop: 'repassword', value: text});}}
                  />


              </View>
              <View style={{ alignItems:'center' }}>
                  <TouchableHighlight style = {styles.submitButton}
                                      underlayColor='transparent' onPress={this.onCreateSet}>
                      <Text ref="register" style = {[styles.submitButtonText, font.TEXTBOX_FONT]}>{strings.register}</Text>
                  </TouchableHighlight>
              </View>
          </ScrollView>

        <Spinner visible={this.state.isLoading}/>

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
    alignItems:'center',
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
    fontFamily:Constant.fontNotoR,
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
    fontFamily:Constant.fontNotoR
  },
  submitButton: {
    borderColor:'rgba(116,196,248,1)',
    borderWidth:1,
    width:width-100,
    alignItems:'center',
    justifyContent:'center',
      marginBottom: 25,
    paddingTop:7,
    paddingBottom:7
  },

  submitButtonText:{
      color:'#000',
      fontFamily:Constant.fontNotoR,
    padding:5
  }
});

mapStateToProps = state => {
  //console.log('sign up',state);
  const {email, password, repassword, coupon} = state.userRegisterForm;
  return {
    email, password, repassword, coupon
  }
};

export default connect(mapStateToProps, actions)(Register);