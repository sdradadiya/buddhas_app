import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, TouchableHighlight, Image, Dimensions, AsyncStorage, StatusBar} from 'react-native';
import {connect, } from 'react-redux';
import font  from '../helper/fontsize';
import strings from '../helper/language';
import NavigationBar from './NavigationBar';
import * as actions from '../actions';
import Router from '../navigationHelper/Router';
import Constant from '../helper/constants';
import Spinner from '../helper/loader';
const {height, width} = Dimensions.get('window');
import TrackPlayer from 'react-native-track-player'

class FirstScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      isLoading:true,
    };
  }

  componentWillMount() {
    this.props.getAllLanguages()
    if(!this.props.isFromSettingScreen) {
      AsyncStorage.getItem('user', (err, result) => {
        this.setDefaultLanguage()
        if(result){
          let user = JSON.parse(result)
          // this.props.userLogin(user.email, user.password, true).then((res) => {

          this.setState({isLoading:false})
          this.props.navigator.replace(Router.getRoute('mainscreen'));

          // }).catch((err) => {
          //
          //   showAlert(err.message)
          //   if(err.isNetworkError){
          //
          //   }else{
          //     this.setState({isLoading:false})
          //   }
          // });
        }
        else{
          this.setState({isLoading:false})
        }
      });
    }
    else{
      this.setState({isLoading:false})
    }
  }

  setDefaultLanguage = () => {
    AsyncStorage.getItem("selected_lang").then((value) => {
      if (value) {
        strings.setLanguage(value);
      }
      else {
        strings.setLanguage('en-US');
      }
    })
  }
  backPressed = () => {
    this.props.navigator.pop()
  };

  onSelectLang = (lang) => {
    //resetPlayer
      this.resetPlayer()

    this.props.userSelectLang(lang, this.props).then((res) =>{

      if(res){
        debugger
          //replace on main navigatorrrr
          console.log("chaged language from setting screen")
          const { navigation } = this.props;
          const navigator = navigation.getNavigatorByUID('drawerNav');
          navigator.setActivateItemCustom("home",0)
          setTimeout(()=>{
              this.props.navigator.pop()
          },10)
         // this.props.navigator.replace(Router.getRoute('mainscreen',{isFirst: false}))
      }else{
        this.props.navigator.push(Router.getRoute('secondscreen'))
      }
    }).catch((err) => {

        debugger
    });
  };

    resetPlayer = () => {

        this.props.setCurrentAudio({
            playerURL: '',
            playerImage: '',
            playerText: '',
            currentTime: 0,
            duration: 0,
            seekTotime: 0,
            playingAudio: false,
            isFirst: false,
            currentlyPlayingAudio: '',
        });
        this.props.showPlayerComponent(false)
        TrackPlayer.reset()
    }


    render() {
    if (this.state.isLoading) {
      return(
        <Spinner visible={this.state.isLoading} />
      );
    }
    return (
      <View style={styles.mainView}>
        {
          (this.props.route.params.isFromSettingScreen === true)&&
          <NavigationBar
            navTitle={strings.selectLang}
            leftButtonPressed = { this.backPressed }
            leftButtonType = {Constant.navButtonType.back}
          />
          ||
          <View style={styles.titleView}>
            <Image source={require('../../images/titleImage.png')}
                   style={{width:Constant.screenWidth/2}}
                   resizeMode='contain'/>
          </View>
        }

        <View style={(this.props.route.params.isFromSettingScreen === true)?styles.languageView_setting:styles.languageView}>
          {
            this.props.allLanguages.map((language, index) => {
             return(
               <TouchableHighlight key={index} onPress={() => this.onSelectLang(language) }
                                   underlayColor='transparent' style={styles.btnStyle}>
                 <Text style={[font.MEDIUM_FONT,styles.titleText, {fontFamily:Constant.fontNotoR}]}>{language.displayName}</Text>
               </TouchableHighlight>
             )
            })
          }

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flexDirection:'column',
    flex:1,
  },
  titleView:{
    alignItems:'center',
    justifyContent:'center',
    width,
    height: height/2.5,
  },
  languageView: {
    alignItems:'center',
    width,
    flexDirection:'column',
  },
  languageView_setting: {
    alignItems:'center',
    flex:1,
    justifyContent:'center',
    width,
    flexDirection:'column',
  },
  titleText: {
    color:'black',
    alignSelf:'center',
    margin:2,
  },
  btnStyle: {
    borderBottomWidth:1,
    borderBottomColor: 'rgba(116,196,248,1)',
    padding:7,
    width: width/2,
  },
});

mapStateToProps = state => {
  const {selected_lang} = state.selectedLang;
  const {allLanguages} = state.userLoginForm;
  return {
    selected_lang,
    allLanguages
  }
};

export default connect(mapStateToProps, actions)(FirstScreen);