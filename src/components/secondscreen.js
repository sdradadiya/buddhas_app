import React, {Component} from 'react';
import {StyleSheet, View, Text, AsyncStorage, TouchableHighlight, Image, Dimensions} from 'react-native';
import font  from '../helper/fontsize';
import strings from '../helper/language';
import Constant from '../helper/constants';
import Router from '../navigationHelper/Router';
const {height, width} = Dimensions.get('window');

class SecondScreen extends Component {
    render() {
        return (
            <View style={styles.mainView}>
                <View style={styles.titleView}>
                    <Image source={require('../../images/titleImage.png')}
                           style={{width:Constant.screenWidth/2}}
                           resizeMode='contain'/>
                </View>

                <View style={styles.contentView}>
                    <View>
                        <Image source={require('../../images/buddhas.png')} resizeMode="contain"
                               style={{height:width-40, width:width-40}} />
                    </View>

                    <View style={{flex:1,justifyContent:'flex-end'}}>
                        <View style={{flexDirection:'row',marginBottom:20, }}>
                            <TouchableHighlight style={[styles.btnStyle, {borderRightWidth:1, borderRightColor:'gray'}]}
                                                underlayColor='transparent' onPress={() => {this.props.navigator.push(Router.getRoute('register'))}}>
                                <Text style={[font.MEDIUM_FONT,styles.titleText]}>{strings.register}</Text>
                            </TouchableHighlight>

                            <TouchableHighlight style={[styles.btnStyle, {}]} underlayColor='transparent'
                                                onPress={() => {this.props.navigator.push(Router.getRoute('signin'))}}>
                                <Text style={[font.MEDIUM_FONT,styles.titleText]}>{strings.signin}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
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
        flex:3,
    },
    contentView: {
        flex:7,
        alignItems:'center',
        width,
        flexDirection:'column',
    },
    titleText: {
        alignSelf:'center',
        margin:2,
        color:'#000',
        fontFamily:Constant.fontNotoR
    },
    btnStyle: {
        width: width/2,
        alignItems:'center',
        padding:10
    }
});

export default SecondScreen;