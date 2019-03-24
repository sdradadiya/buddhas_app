import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, Alert,TextInput,ScrollView ,
  FlatList,Dimensions,AsyncStorage } from 'react-native';
import cs from '../helper/customStyles';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import Constant from '../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar'
import Router from '../navigationHelper/Router'
import strings from '../helper/language';
import font  from '../helper/fontsize';
import {connect, } from 'react-redux';
import {clearStoreData,userLoginUpdate,logoutUser} from '../actions/loginAction'
import {userRegisterUpdate} from '../actions/registerAction'
import {setCurrentAudio,showPlayerComponent} from '../actions/playerAction'
import Spinner from './loader'

const h=Dimensions.get('window').height;
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


class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      isLoading: false,
      selectedLanguage: this.props.selected_lang
    }
  }
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


    onSignoutPress(){

    AsyncStorage.removeItem('user').then((res) => {
         this.props.logoutUser();
        this.props.navigator.replace(Router.getRoute('firstscreen'))
    })

  }

  onClearDataPressed = () => {
    Alert.alert("",
      "Are you sure, you want to clear all the data?",
      [
        {text: 'Yes', onPress: () => {

          this.setState({
            isLoading:true
          })
          this.props.clearStoreData().then((res) => {
            this.setState({
              isLoading:false
            })
          }).catch((err) => {
            this.setState({
              isLoading:false
            })
          })

        }},
        {text: 'No', onPress: () => console.log('OK Pressed')},
      ],
      { cancelable: false }
    );

  }

  menuPressed = () => {
    const { navigation } = this.props;
    const navigator = navigation.getNavigatorByUID('drawerNav');
    navigator.toggleDrawer()
  };
    backtoHome = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.setActivateItemCustom("home",0)
    };

  render() {

    return (
      <View style={[cs.flx1]}>
        <NavigationBar
          navTitle={strings.settings}
          leftButtonPressed = { this.backtoHome }
          leftButtonPressedMenu = { this.menuPressed }
          leftButtonType = {Constant.navButtonType.menuBack}
        />

        <ScrollView style={styles.languageView}>
          <TouchableHighlight underlayColor='transparent' style={styles.btnStyle}
                              onPress={() => {
                                this.onClearDataPressed()
                              } }>
            <Text style={[font.MEDIUM_FONT,styles.titleText]}>{strings.cleardata}</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => {
              this.props.navigator.push(Router.getRoute('firstscreen',{isFromSettingScreen: true}))

            }
            }
            underlayColor='transparent' style={styles.btnStyle}>
            <Text style={[font.MEDIUM_FONT,styles.titleText]}>{strings.changelang}</Text>
          </TouchableHighlight>
          <View style={{marginTop:h*40/667}}>
            <TouchableHighlight
              onPress={() => this.props.navigator.push(Router.getRoute('changepass')) }
              underlayColor='transparent' style={styles.btnStyle}>
              <Text style={[font.MEDIUM_FONT,styles.titleText]}>{strings.changepass}</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight onPress={() =>
               this.props.navigator.push(Router.getRoute('termsAndPolicy'))}
           underlayColor='transparent'
                              style={[styles.btnStyle,{marginTop:h*80/667}]}>
            <Text style={[font.MEDIUM_FONT,styles.titleText]}>{strings.terms}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() =>{ this.onSignoutPress()} } underlayColor='transparent'  style={styles.btnStyle}>
            <Text style={[font.MEDIUM_FONT,styles.titleText]}>{strings.signout}</Text>
          </TouchableHighlight>

        </ScrollView>

        <Spinner visible={this.state.isLoading}/>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  languageView: {
    width:Constant.screenWidth,
  },
  titleText: {
    fontFamily: Constant.fontNotoR,
    color:'#000',
  },
  btnStyle: {
    marginLeft:20,
    marginRight:20,
    borderBottomWidth:1,
    borderBottomColor: 'rgba(185,186,187,1)',
    paddingTop:15,
    paddingBottom:15,
  }
});
mapStateToProps = state => {
  return {
    selected_lang: state.selectedLang.selected_lang
  }
};

export default connect(mapStateToProps, {
  clearStoreData,userLoginUpdate,userRegisterUpdate,showPlayerComponent,setCurrentAudio,logoutUser
})(Settings);

