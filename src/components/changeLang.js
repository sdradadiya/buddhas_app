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

import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class FirstScreen extends Component {
    static navigationOptions = {
        header: null,
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

    constructor(props){
        super(props);
        this.state = {
        };
    }

    backPressed = () => {
        this.props.navigator.pop()
    };

    onSelectLang = (lang) => {
        this.props.userSelectLang(lang, null).then((res) =>{
            this.props.navigator.pop()

            this.props.onBackToselectLanguage()
        }).catch((err) => {

        });
    };

    render() {
        return (
            <View style={styles.mainView}>
              <NavigationBar
                  navTitle={strings.selectLang}
                  leftButtonPressed = { this.backPressed }
                  leftButtonType = {Constant.navButtonType.back}
              />

              <View style={styles.languageView_setting}>
                  {
                      this.props.route.params.languagesPurchased.map((language, index) => {
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