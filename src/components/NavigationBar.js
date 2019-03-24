import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight} from 'react-native';
import cs from '../helper/customStyles';
import {Icon} from 'react-native-elements';
import {Button, Grid, Col} from 'native-base';
import {
    NavigationStyles
} from '@expo/ex-navigation';
import csFont from '../helper/fontsize';
import Constant from '../helper/constants'
import { showPlayerComponent } from '../actions/playerAction'
import {connect} from 'react-redux';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftButtonType:  this.props.leftButtonType || 'menu'
        };
    }
    renderRightIcon = () => {
        if(this.state.leftButtonType === Constant.navButtonType.menu){
            return (
                <TouchableHighlight style={{height: '100%',alignItems:'center',justifyContent:'center'}}
                                    underlayColor='transparent'
                                    onPress={() => {

                                        this.props.leftButtonPressed()
                                    } } >
                    <View>
                        <Icon
                            size={20}
                            name='navicon'
                            type='font-awesome'
                            color='#000'
                        />
                    </View>
                </TouchableHighlight>
            )
        }else if(this.state.leftButtonType === Constant.navButtonType.back){
           return(
               <TouchableHighlight style={{height: '100%',alignItems:'center',justifyContent:'center'}}
                                   underlayColor='transparent'
                                   onPress={ this.props.leftButtonPressed } >
                   <View>

                       <Icon
                           size={25}
                           name='ios-arrow-back'
                           type='ionicon'
                           color='#000'
                       />
                   </View>
               </TouchableHighlight>

           )
        }else{
            return (
                <View style={{flexDirection:'row'}}>
                    <Col size={2}>
                        <TouchableHighlight style={{height: '100%',alignItems:'center',justifyContent:'center'}}
                                            underlayColor='transparent'
                                            onPress={ this.props.leftButtonPressed } >
                            <View>

                                <Icon
                                    size={25}
                                    name='ios-arrow-back'
                                    type='ionicon'
                                    color='#000'
                                />
                            </View>
                        </TouchableHighlight>
                    </Col>
                    <Col size={1.5}>

                        <TouchableHighlight style={{height: '100%',alignItems:'center',justifyContent:'center'}}
                                            underlayColor='transparent'
                                            onPress={() => {

                                                // this.props.showPlayerComponent(false)
                                                this.props.leftButtonPressedMenu()
                                            } } >
                            <View>
                                <Icon
                                    size={20}
                                    name='navicon'
                                    type='font-awesome'
                                    color='#000'
                                />
                            </View>
                        </TouchableHighlight>
                    </Col>
                </View>

            )
        }
    }
    render() {
        return (
            <View style={[cs.jcBetween,cs.navHeight,cs.bg000,{alignItems:'center',shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,paddingTop:(Constant.IOS)?15:0, zIndex: 15, height: (Constant.IOS)?64:50}]}
                  elevation={15}>
                <Grid>
                    <Col size={(this.state.leftButtonType === Constant.navButtonType.menuBack)?2.5:1.5}>
                            {
                                this.renderRightIcon()
                            }
                    </Col>
                    <Col size={7} style={{alignItems:'center',justifyContent:'center'}}>
                        <Text numberOfLines={1} style={[cs.bg000,cs.tc,csFont.XXMEDIUM_FONT,{color:'#000', fontFamily:Constant.fontNotoB}]}>{ this.props.navTitle }</Text>
                    </Col>
                    <Col size={(this.state.leftButtonType === Constant.navButtonType.menuBack)?2.5:1.5}>
                        <Text> </Text>
                    </Col>
                </Grid>
            </View>
        )
    }
}
/*
*/
mapStateToProps = state => {
    const { showPlayer } = state.player;

    return {
        showPlayer
    }
};

export default connect(mapStateToProps, {
    showPlayerComponent
})(NavigationBar);

