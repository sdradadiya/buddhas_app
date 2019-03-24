import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,TextInput,ScrollView ,
    FlatList,Dimensions,Alert,Platform,WebView } from 'react-native';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import Constant from '../helper/constants'
import NavigationBar from './NavigationBar'
import strings from '../helper/language';
import {connect} from 'react-redux';
import { showPlayerComponent } from '../actions/playerAction'
import TrackPlayer from 'react-native-track-player'
import font  from '../helper/fontsize';
import Router from '../navigationHelper/Router';
import Button from './signinComponents/buttonComponent'


import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class CouponCode extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            couponCode: '',
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
        debugger
        this.props.navigator.pop()
    };

    onRedeem = () => {
        if(this.state.couponCode === ''){
            Alert.alert("Enter Coupon Code")
        }else{
            this.props.navigator.push(Router.getRoute("couponRedeemed"))
        }
    }
    render() {
        debugger
        return (
            <View style={{flex:1}}>
                <NavigationBar
                    navTitle={strings.store}
                    leftButtonPressed = { this.backPressed }
                    leftButtonType = {Constant.navButtonType.back}
                />
                <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                    <TextInput style = {[font.TEXTBOX_FONT,{    width:Constant.screenWidth-100,
                        height: (Platform.OS === 'android') ? 40 : 30,
                        borderBottomColor: 'rgb(116,196,248)',
                        borderBottomWidth: 1,
                        margin: (Platform.OS === 'android') ? 15 : 20,
                        marginBottom:3,
                        fontFamily:Constant.fontNotoR,
                        textAlign: 'center'
                    }]}
                               ref="email"
                               returnKeyType={"done"}
                               blurOnSubmit={true}
                               underlineColorAndroid = "transparent"
                               placeholder = {'Coupon Code'}
                               autoCapitalize = "none"
                               autoCorrect={false}
                               value={this.state.couponCode}
                               onChangeText={(text) => {this.setState({ couponCode: text});}}
                    />
                    <Text style={[font.XLMEDIUM_FONT,{color:'#000',fontFamily: Constant.fontNotoR,marginBottom:50,width:Constant.screenWidth-100}]}>
                        XXX-ITBF-XXXXXXX
                    </Text>
                    <Button title={'Redeem'} nextClicked={this.onRedeem} otherStyle={{paddingTop:0,paddingBottom:0}}/>
                </View>
                <Button title={'skip'} nextClicked={this.backPressed} otherStyle={{paddingTop:0,paddingBottom:0,marginBottom:50}}/>
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
})(CouponCode);

