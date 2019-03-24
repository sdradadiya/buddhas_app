/**
 * Created by LaNet on 4/27/17.
 */
import React, { Component } from 'react';
import { ActivityIndicator,
    View, Image }
    from 'react-native';

class Loader extends Component{

    render(){
        return( (this.props.visible) ?
                    <View style={{ position:'absolute', backgroundColor: 'rgba(0,0,0,0.5)',
                    height: '100%', width: '100%',
                    alignItems:'center', justifyContent:'center',zIndex:1000}}>
                        <ActivityIndicator
                            animating={true}
                            size="large"
                            color={'#FFF'}
                        />
                    </View>
                : null
        );
    }
}

module.exports = Loader;