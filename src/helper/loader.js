import React, { Component } from 'react';
import { ActivityIndicator,
    View, Image }
    from 'react-native';
import Constant from '../helper/constants';

class Loader extends Component{

    render(){
        return( (this.props.visible) ?
                    <View style={{ position:'absolute', backgroundColor: '#fff',
                    height: Constant.screenHeight, width:Constant.screenWidth,
                    alignItems:'center', justifyContent:'center'}}>
                        <ActivityIndicator
                            animating={true}
                            size="large"
                            color='rgba(0,0,0,0.6)'
                        />
                    </View>
                : null
        );
    }
}

module.exports = Loader;