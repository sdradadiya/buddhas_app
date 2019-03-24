import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,TextInput,ScrollView ,
    FlatList,Dimensions,AsyncStorage,Platform,WebView } from 'react-native';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import Constant from '../helper/constants'
import NavigationBar from './NavigationBar'
import strings from '../helper/language';
import {connect} from 'react-redux';
import { showPlayerComponent } from '../actions/playerAction'
import TrackPlayer from 'react-native-track-player'
import font  from '../helper/fontsize';


import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class Transcript extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: this.props.route.params.title,
            transcript: this.props.route.params.transcript
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

    backPressed = () => {
        this.props.navigator.pop()
    };

    menuPressed = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.toggleDrawer()
    };

    render() {
        debugger
        return (
            <View style={{flex:1}}>
                <NavigationBar
                    navTitle={strings.transcript}
                    leftButtonPressed = { this.backPressed }
                    leftButtonType = {Constant.navButtonType.back}
                />
                <View style={{flex:1,paddingLeft:30,paddingRight:30,paddingTop:10}}>
                    <Text style={[ font.MEDIUM_FONT, {color:'#000',fontFamily: Constant.fontNotoB,textAlign:'center'}]}>
                        {this.state.title}</Text>
                    <View style={{height:1,backgroundColor:'lightgray',marginTop:10,marginBottom:10}}/>
                    <ScrollView>

                        <Text style={[ font.MEDIUM_FONT, {color:'#000',fontFamily: Constant.fontNotoR}]}>
                            {this.state.transcript}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        );
    }
}


mapStateToProps = state => {
    const {selected_lang} = state.selectedLang;

    return {
        selected_lang
    }
};

export default connect(mapStateToProps, {
    showPlayerComponent
})(Transcript);

