import React from 'react';
import { Alert, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,TextInput,ScrollView ,
    FlatList,Dimensions,AsyncStorage, } from 'react-native';
import cs from '../helper/customStyles';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import {connect} from 'react-redux';
import {getCurrentSites, downloadSitesData, clearPackData } from '../actions/loginAction'
import { showPlayerComponent } from '../actions/playerAction'
import Constant from '../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar'
import strings from '../helper/language';
import font  from '../helper/fontsize';
import DownloadHeader from './downloadComponent/downloadHeader1';
import TrackPlayer from 'react-native-track-player'

import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class FootSteps extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };

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


    menuPressed = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.toggleDrawer()
    };
    backtoHome = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.setActivateItemCustom("home",0)
    };
    backPressed = () => {
        this.props.navigator.pop()
    }
    onDownloadOrDeletePressed = (task, obj, objIndex) => {

        if(task === "download"){
            //download all data
            obj.sites.map((site,siteIndex) => {
                setTimeout(() => {
                    this.props.downloadSitesData(site.audioURL,obj.language,site._id,siteIndex,'audioURL',objIndex,this.props.allPacks)
                },0)

            })
        }else{
            //delete all data
            this.props.clearPackData(obj._id)
        }
    }
    onDownloadSiteDataPressed = (site,siteIndex,obj,objIndex) => {
        setTimeout(() => {
            this.props.downloadSitesData(site.audioURL,obj.language,site._id,siteIndex,'audioURL',objIndex,this.props.allPacks)
        },0)
    }
    renderPacks = (currentPacks) => {
        debugger
        return (
            <DownloadHeader packData={currentPacks}
                            backPressed={this.backPressed}/>
        )
    }
    render() {
debugger
        return (
            <View style={[cs.flx1,{backgroundColor: 'lightgray'}]}>
                <NavigationBar
                    navTitle={strings.myPacks}
                    leftButtonPressed={this.backPressed}
                    leftButtonType={Constant.navButtonType.back}
                />
                {
                    (this.props.currentPacks && this.props.currentPacks.length > 0)?
                        <ScrollView>
                            {this.renderPacks([this.props.currentPacks[this.props.route.params.packIndex]])}
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
    outerView:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'#cccccc',
        height:50,

    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 2,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 5,
        backgroundColor: '#0CB2F6',
    },
    innerProgressRemaining: {
        height: 5,
        backgroundColor: '#2C2C2C',
    },
    mainView: {
        //backgroundColor:'red'
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    containers: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    viewImages: {
        alignSelf:'center',
        marginTop:5
    },
    btnimages: {
        marginBottom:4,
    },
    titleTexts:{
        borderBottomWidth:1,
        borderBottomColor:'lightgray',
        marginTop:0,
    }
});

mapStateToProps = state => {

    const { currentPacks, allPacks } = state.userLoginForm;

    return {
        currentPacks,
        allPacks
    }
};

export default connect(mapStateToProps, {
    getCurrentSites, downloadSitesData,clearPackData, showPlayerComponent
})(FootSteps);

