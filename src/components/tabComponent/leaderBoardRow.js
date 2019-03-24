import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import Constant from '../../helper/constants';

export default  class LeaderBoardRow extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={styles.streakVal}>
                <Image source={this.props.uri} style={styles.img} resizeMode="contain" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    streakText:{
        color: '#FFF',
        fontSize:12,
    },
    streakVal:{
        alignItems:'center',
    },
    img:{
        width: Constant.screenWidth-20,
        height: (Constant.screenWidth-20)/1.5,
      margin: 10
    }
});