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
import Button from './signinComponents/buttonComponent'
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';


import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class CouponRedeem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
    componentDidMount() {
    }
    backPressed = () => {
        this.props.navigator.popToTop()
    };
    gotoPacks = () => {

        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.setActivateItemCustom("My Packs",4)
        setTimeout(()=>{
            this.props.navigator.popToTop()
        },10)
    };

    render() {
        debugger
        return (
            <View style={{flex:1}}>
                <NavigationBar
                    navTitle={strings.store}
                    leftButtonPressed = { this.backPressed }
                    leftButtonType = {Constant.navButtonType.back}
                />
                <View style={{flex:1}}>

                    <Text style={[font.MEDIUM_FONT,{color:'#000', fontFamily: Constant.fontNotoR, marginTop:20,textAlign:'center'}]}>
                        Coupon Code
                    </Text>
                    <Text style={[font.MEDIUM_FONT,{color:'#000', fontFamily: Constant.fontNotoB, marginTop:15,marginBottom:15,textAlign:'center'}]}>
                        RUS-ITBF-0000001
                    </Text>
                    <View style={{shadowColor: '#000000',backgroundColor: '#fff',
                        shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,marginTop:10,marginBottom:10}}
                          elevation={5}>
                            <View style={styles.mainView}>
                                <View style={styles.img}>
                                    <Image source={require('../../images/buddhas.png')} style = {{
                                        width: Constant.screenWidth/2.3,
                                        height: Constant.screenWidth/2.3
                                    }} />
                                </View>
                                <View style={{flex:1,padding:10,justifyContent:'space-between'}}>
                                    <View>
                                        <Text style={[font.XLMEDIUM_FONT,{color:'#000',fontFamily: Constant.fontNotoR, marginBottom:5}]}>
                                            {strings.in+ ' ' +strings.buddha+ ' ' +strings.footsteps}
                                        </Text>
                                        <Text style={[font.MEDIUM_FONT,{color:'#000', fontFamily: Constant.fontNotoB, marginBottom:5}]}>
                                            {'Russian Pack'}
                                        </Text>
                                        <Text style={[font.SMALL_FONT,{color:'#000', fontFamily: Constant.fontNotoR, marginBottom:5}]}>
                                            {"Sites includes:\n" +'Lumini,Budhgaya,Sarnath,Kushinagara,Sravasthi,Vaishali,Rajgir,sankasy'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                    </View>
                    <Animatable.View animation="zoomIn" duration={500} delay={200}
                        ref='check'
                    >
                    <Icon
                        iconStyle={{shadowColor: '#000000',
                            shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, alignSelf:'center',marginBottom:5,marginTop:15}}
                        elevation={15}
                        name={'check-circle'}
                        type={'font-awesome'}
                        size={65}
                        color={'rgb(34,214,39)'}/>
                    </Animatable.View>
                    <Text style={[font.MEDIUM_FONT,{color:'#000', fontFamily: Constant.fontNotoR, textAlign:'center'}]}>
                        Redeemed
                    </Text>
                </View>
                <Button title={strings.myPacks} nextClicked={this.gotoPacks}
                        otherStyle={{paddingTop:0,paddingBottom:0,marginBottom:50,justifySelf:'flex-end'}}/>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    mainView:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'lightgray',
    },
    img:{
        padding:10,
        paddingRight:0
    },

});


mapStateToProps = state => {
    const {selected_lang} = state.selectedLang;

    return {
        selected_lang
    }
};

export default connect(mapStateToProps, {
    showPlayerComponent
})(CouponRedeem);

