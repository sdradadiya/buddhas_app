import React,{ Component} from 'react';
import {ScrollView,View,Dimensions, StyleSheet, Text, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar';
import strings from '../helper/language';
import Constant from '../helper/constants';
import {
    getUrl
} from '../helper/commonFunctions';
import Router from '../navigationHelper/Router';
import {connect} from 'react-redux';
import {getCurrentSites} from '../actions/loginAction'
import {showPlayerComponent} from '../actions/playerAction'
import font  from '../helper/fontsize';
import TrackPlayer from 'react-native-track-player'
import {mainFiles,getIndex} from "../helper/commonFunctions";

const width=Dimensions.get('window').width;

import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class Sites extends Component{
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        TrackPlayer.getState().then((state) => {
            if(state === Constant.playingState){
                this.props.showPlayerComponent(true)
            }
        });

        if(this.props.currentSites && this.props.currentSites.length > 0) {
            this.props.getCurrentSites()
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

    renderUsers(){
        return this.props.currentSites.map((site,siteIndex) => {
            return (
                <View style={styles.containers} key={site._id}>
                    <TouchableOpacity style={styles.btn}
                                      onPress={() => {
                                          this.props.navigator.push(Router.getRoute('videodetailedview',
                                              {isFromHomeScreen: true,index:siteIndex,allSites: this.props.currentSites
                                              }))
                                      }}>

                        <Image source={mainFiles[getIndex(this.props.selected_lang.language,site.siteId.name,"coverImageURL")]}
                               style = {{opacity:0.9, width: Constant.screenWidth-30,
                                   height: (Constant.screenWidth-30)/1.5 }} >
                        </Image>
                        {/*<View style={styles.txtView}>*/}
                        {/*<Text style={[font.TITLE_FONT, styles.txt]}>{site.siteId}</Text>*/}
                        {/*</View>*/}
                    </TouchableOpacity>

                </View>
            )
        });
    }

    menuPressed = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.toggleDrawer()
        //const rootNavigator = this.props.navigation.getNavigator("home");
        //const rootNavigator1 = this.props.navigation.getNavigator("allsites");
        //rootNavigator.immediatelyResetStack([Router.getRoute('homescreen')], 0)
        //rootNavigator.popToTop();
        //rootNavigator1.popToTop();
    };
    backPressed = () => {
        if(this.props.route.params.isFromHomeScreen === true){
            this.props.navigator.pop()
        }else{
            const { navigation } = this.props;
            const navigator = navigation.getNavigatorByUID('drawerNav');
            navigator.setActivateItemCustom("home",0)
        }
    };

    render(){
        return(
            <View style={{flex:1}}>
                <NavigationBar
                    navTitle={strings.site}
                    leftButtonPressed = { this.backPressed }
                    leftButtonPressedMenu = { this.menuPressed }
                    leftButtonType = {Constant.navButtonType.menuBack}
                />
                {
                    (this.props.currentSites && this.props.currentSites.length > 0) ?
                        <ScrollView>
                            {this.renderUsers()}
                        </ScrollView>
                        :
                        <View style={ [styles.containers,{height:'100%',width:'100%'}]}>
                            <Text style={[font.MEDIUM_FONT,{ alignSelf: 'center', color:'#000',fontFamily:Constant.fontNotoB}]}>
                                {strings.noData}</Text>
                        </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containers: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomWidth:1,
        // borderBottomColor:'lightgray',
        flexDirection:'row',
    },
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn:{
        padding:10,
    },
    txt:{
        color:'#fff',
        backgroundColor:'transparent',
        fontFamily: Constant.fontNotoR
    },
    txtView:{
        alignItems:'flex-end',
        position:'absolute',
        alignSelf:'flex-end',
        padding:15}
});

mapStateToProps = state => {
    const { currentSites } = state.userLoginForm;
    const { selected_lang } = state.selectedLang;

    return {
        currentSites,
        selected_lang
    }
};

export default connect(mapStateToProps, {
    getCurrentSites, showPlayerComponent
})(Sites);

