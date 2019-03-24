import React from 'react';
import { Alert, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,TextInput,ScrollView ,
    FlatList,Dimensions,AsyncStorage, } from 'react-native';
import cs from '../helper/customStyles';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import {connect} from 'react-redux';
import {getCurrentSites, downloadSitesData, clearPackData , downloadSiteAudio,downloadSingleSiteAudio} from '../actions/loginAction'
import {showPlayerComponent} from '../actions/playerAction'
import Constant from '../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar'
import strings from '../helper/language';
import font  from '../helper/fontsize';
import DownloadHeader from './downloadComponent/downloadHeader';
import TrackPlayer from 'react-native-track-player'
var RNFS = require('react-native-fs');

import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class MyPacks extends React.Component {

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

    onDownloadOrDeletePressed = (task, obj, objIndex) => {

        if(task === "download"){
            //download all data
            debugger
            let dirs = '';
            if (Constant.IOS) {
                dirs = RNFS.DocumentDirectoryPath
            } else {
                dirs = RNFS.ExternalDirectoryPath
            }
            RNFS.getFSInfo(dirs)
                .then ((info) => {
                    // console.log("Free Space is" + info.freeSpace + "Bytes")
                    // console.log("Free Space is" + info.freeSpace / 1024 + "KB")

                    if((info.freeSpace / 1024 / 1024) > 200){
                        this.props.downloadSiteAudio(obj.language);
                    }
                    else{
                        Alert.alert("Your device doesn't have enough memory space to download this file")
                    }
                })
            // let downloadArray = _.cloneDeep(this.props.sitesAudioObject[obj.language])

            // obj.sites.map((site,siteIndex) => {
            // console.log("siteIndex:",siteIndex)
            // this.props.addtoMainDownloadingQueue({
            //     type: "sites",
            //     key: "audioURL",
            //     data: site,
            //     objLanguage: obj.language,
            //     objID:obj._id,
            //     newPacks: this.props.allPacks,
            //     objIndex: objIndex,
            //     siteIndex: siteIndex,
            //     isFromQueue: true
            // })
            // })
            // this.props.startDownloadingQueue()
        }else{
            //delete all data
            this.props.clearPackData(obj.language)
        }
    }
    onDownloadSiteDataPressed = (site,siteIndex,obj,objIndex,singleDownloadObject) => {
        debugger
        let dirs = '';
        if (Constant.IOS) {
            dirs = RNFS.DocumentDirectoryPath
        } else {
            dirs = RNFS.ExternalDirectoryPath
        }
        RNFS.getFSInfo(dirs)
            .then ((info) => {
                // console.log("Free Space is" + info.freeSpace + "Bytes")
                // console.log("Free Space is" + info.freeSpace / 1024 + "KB")

                if((info.freeSpace / 1024 / 1024) > 20){
                    this.props.downloadSingleSiteAudio(singleDownloadObject)
                }
                else{
                    Alert.alert("Your device doesn't have enough memory space to download this file")
                }
            })
        // this.props.addtoMainDownloadingQueue({
        //     type: "sites",
        //     key: "audioURL",
        //     data: site,
        //     objID:obj._id,
        //     objLanguage: obj.language,
        //     newPacks: this.props.allPacks,
        //     objIndex: objIndex,
        //     siteIndex: siteIndex,
        //     isFromQueue: false
        // })
        // this.props.startDownloadingQueue()
    }
    renderPacks = (currentPacks) => {
        return (
            <DownloadHeader packData={currentPacks}
                            onDownloadSiteDataPressed={this.onDownloadSiteDataPressed}
                            onDownloadOrDeletePressed={this.onDownloadOrDeletePressed}/>
        )
    }
    render() {
        debugger
        return (
            <View style={[cs.flx1,{backgroundColor: 'lightgray'}]}>
                <NavigationBar
                    navTitle={strings.myPacks}
                    leftButtonPressed={this.backtoHome}
                    leftButtonPressedMenu={this.menuPressed}
                    leftButtonType={Constant.navButtonType.menuBack}
                />
                {
                    (this.props.currentPacks && this.props.currentPacks.length > 0)?
                        <ScrollView>
                            {this.renderPacks(this.props.currentPacks)}
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

    const { currentPacks, allPacks,sitesAudioObject } = state.userLoginForm;

    return {
        currentPacks,
        allPacks,
        sitesAudioObject
    }
};

export default connect(mapStateToProps, {
    getCurrentSites, downloadSitesData,clearPackData,showPlayerComponent,downloadSiteAudio,downloadSingleSiteAudio
})(MyPacks);

