import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    TouchableHighlight,
    View,
} from 'react-native';
import Constant from '../../helper/constants';
import * as Animatable from 'react-native-animatable';
import font from '../../helper/fontsize';


export default class tabLabelComponent extends Component {

    constructor(props){
        super(props);
    }

    clicked = () => {
        if(this.props.text && this.props.text !== "") {
                this.props.labelClicked(this.props.text)
        }
    };

    render() {
        return (
                <TouchableHighlight onPress={()=>{
                        this.clicked();
                    }} style={{width:Constant.screenWidth/3, }} underlayColor={'transparent'}>
                    <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Text style={[font.MEDIUM_FONT,{ alignSelf: 'center', color:'#000',fontFamily:(this.props.text === this.props.currentLabel)?Constant.fontNotoB:Constant.fontNotoR}]}>
                            {this.props.text}
                        </Text>
                    </View>
                </TouchableHighlight>

        );
    }
}
