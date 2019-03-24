import React, {Component} from 'react';
import { View, Text, } from 'react-native';

const Header = (props) => {
    return (
        <View style={{ backgroundColor:'#007AFF', justifyContent:'center', padding:12 }}>
            {/*<Header headerText={'Home'}/>*/}
            <Text style={{color:'white', fontSize:18, alignSelf:'center'}}>{props.headerText}</Text>
        </View>
    );
};

export default Header;