import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,TextInput,ScrollView ,
    FlatList,Dimensions,AsyncStorage, } from 'react-native';
import cs from '../helper/customStyles';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import Constant from '../helper/constants'
import NavigationBar from './NavigationBar'
import strings from '../helper/language';
import font  from '../helper/fontsize';
import {connect} from 'react-redux';
import { showPlayerComponent} from '../actions/playerAction'
import TrackPlayer from 'react-native-track-player'
import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'
import {getUrl} from '../helper/commonFunctions';

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation


class AboutView extends React.Component {

    constructor(props) {
        super(props);
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
            <View style={[cs.flx1]}>
                <NavigationBar
                    navTitle={strings.about}
                    leftButtonPressed = { this.backPressed }
                    leftButtonType = {Constant.navButtonType.back}
                />

                <View style={styles.languageView}>
                    <View style={styles.imgView}>
                        <Image source={this.props.route.params.authorImagePath} style={styles.img} />
                    </View>
                </View>

                <ScrollView>
                    <View style={styles.txtData}>
                        <Text style={[font.MEDIUM_FONT, {color:'#000', fontFamily: Constant.fontNotoB, paddingBottom:15}]}>
                            {(this.props.introduction)&&this.props.introduction.languageId.authorName||''}
                        </Text>
                        <Text style={[font.MEDIUM_FONT,{color:'#000', fontFamily: Constant.fontNotoR,padding:2}]}>
                            {(this.props.introduction)&&this.props.introduction.languageId.authorIntro||''}
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    languageView: {
    },
    titleText: {
    },
    txtData: {
        padding:10,
    },
    imgView:{
        alignItems: 'center',
        margin:10,
        borderBottomWidth:1,
        borderBottomColor:'rgba(198,199,199,1)',
    },
    img:{
        width: Constant.screenWidth-20,
        height: (Constant.screenWidth-20)/1.5
    }
});

mapStateToProps = state => {
    const { introduction } = state.userLoginForm;

    return {
        introduction
    }
};

export default connect(mapStateToProps, {
    showPlayerComponent
})(AboutView);

