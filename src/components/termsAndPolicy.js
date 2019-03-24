import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,TextInput,ScrollView ,
    FlatList,Dimensions,AsyncStorage,Platform,WebView } from 'react-native';
import cs from '../helper/customStyles';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import Constant from '../helper/constants'
import NavigationBar from './NavigationBar'
import strings from '../helper/language';
import {connect} from 'react-redux';
import { showPlayerComponent } from '../actions/playerAction'
import TrackPlayer from 'react-native-track-player'
import Pdf from 'react-native-pdf';

let allLanguages = ["5","1","2","4","3"];

import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class TermsAndPolicy extends React.Component {

    constructor(props) {
        super(props);

        let pdfPathofTerms = '';
        if(Constant.IOS){
            pdfPathofTerms = this.getPdfPathIOS(this.props.selected_lang.language)
        }else{
            pdfPathofTerms = this.getPdfPathAndroid(this.props.selected_lang.language)
        }
        debugger
        this.state = {
            terms: pdfPathofTerms
        }
    }

    componentWillMount(){
        TrackPlayer.getState().then((state) => {
            if(state === Constant.playingState){
                this.props.showPlayerComponent(true)
            }
        })

    }
    getPdfPathIOS = (lan) => {
        switch (lan){
            case "Spanish":
                return require('../PDF/Spanish.pdf')
            case "French":
                return require('../PDF/French.pdf')
            case "Russian":
                return require('../PDF/Russian.pdf')
            case "Chinese":
                return require('../PDF/Chinese.pdf')
            case "English":
                return require('../PDF/English.pdf')
            default:
                return ''
        }
    }
    getPdfPathAndroid = (lan) => {
        switch (lan){
            case "Spanish":
                return {uri:"bundle-assets://PDF/Spanish.pdf"}
            case "French":
                return {uri:"bundle-assets://PDF/French.pdf"}
            case "Russian":
                return {uri:"bundle-assets://PDF/Russian.pdf"}
            case "Chinese":
                return {uri:"bundle-assets://PDF/Chinese.pdf"}
            case "English":
                return {uri:"bundle-assets://PDF/English.pdf"}
            default:
                return ''
        }
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
                    navTitle={strings.terms}
                    leftButtonPressed = { this.backPressed }
                    leftButtonType = {Constant.navButtonType.back}
                />

                {(this.state.terms !== '')&&
                (Platform.OS === 'ios') ?
                    <WebView
                        hasZoom={true}
                        maxZoom={2}
                        scalesPageToFit={true}
                        scrollEnabled={true}
                        source={this.state.terms}
                        style={{flex: 1}}
                        onLoadStart={() => {
                            console.log("Loading start");
                        }}
                        onLoadEnd={()=> {
                            console.log("Loading end");
                        }}

                    />:
                    <Pdf ref={(pdf)=>{this.pdf = pdf;}}
                         source={this.state.terms}
                         page={1}
                         horizontal={false}
                         onLoadComplete={(pageCount)=>{
                             this.setState({pageCount: pageCount});
                             console.log(`total page count: ${pageCount}`);
                         }}
                         onPageChanged={(page,pageCount)=>{
                             this.setState({page:page});
                             console.log(`current page: ${page}`);
                         }}
                         onError={(error)=>{
                             console.log(error);
                         }}
                         style={{        flex:1,
                             width:Dimensions.get('window').width,
                         }}/>
                    ||
                    <View/>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#000', // make links coloured pink
    },
    span:{
        color:'red',
        backgroundColor:'yellow'
    },

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
    const {selected_lang} = state.selectedLang;

    return {
        selected_lang
    }
};

export default connect(mapStateToProps, {
    showPlayerComponent
})(TermsAndPolicy);

