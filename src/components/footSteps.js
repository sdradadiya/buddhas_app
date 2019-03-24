import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,TextInput,ScrollView ,
    FlatList,Dimensions,AsyncStorage, } from 'react-native';
import cs from '../helper/customStyles';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import {connect} from 'react-redux';
import {getCurrentSites,downloadSitesData,addtoMainDownloadingQueue,downloadSingleSiteAudio} from '../actions/loginAction'
import Constant from '../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar'
import strings from '../helper/language';
import font  from '../helper/fontsize';
import LeaderboardIndividualTab from './tabComponent/leaderboardIndividualTab';
import Player from './DisplayPlayerComponent'
var lastIndex = -1;
import { setCurrentAudio, setPlayerValues, showPlayerComponent } from '../actions/playerAction'
import {mainFiles,getIndex} from "../helper/commonFunctions";

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
            selectedIndex:0,
        };

    }

    componentWillMount(){
        if(this.props.currentSites && this.props.currentSites.length > 1){
            this.props.getCurrentSites()
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.player.footStep === -30){
            debugger
            this.props.setPlayerValues({ prop: 'footStep', value: 0})

            this.getTabItem(-30)
        }
    }
    getTabItem = (item) => {
        debugger
        if(item === -30){
            let nextIndex = 0
            if(this.props.currentSites && this.props.currentSites.length-1 === this.state.selectedIndex){
                nextIndex = 0
            }else{
                nextIndex = this.state.selectedIndex+1
            }
//Play next audio directly
            debugger
            if(this.props.currentSites[nextIndex].isDownload === 2){
                let playerInstance = {
                    playerURL: this.props.currentSites[nextIndex].audioURL,
                    playerImage: this.props.currentSites[nextIndex].footstepImageURL,
                    playerText: this.props.currentSites[nextIndex].displayName,
                    currentTime: 0,
                    duration: 0,
                    seekTotime: 0,
                    playingAudio: true,
                    currentlyPlayingAudio: ('footstep-'+nextIndex+this.props.selected_lang._id),
                    isFirst: false
                };

                this.props.setCurrentAudio(playerInstance)
            }else{
                let playerInstance = {
                    playerURL: this.props.player.playerURL,
                    playerImage: this.props.player.playerImage,
                    playerText: this.props.player.playerText,
                    currentTime: 0,
                    duration: 0,
                    seekTotime: 0,
                    playingAudio: false,
                    currentlyPlayingAudio: this.props.player.currentlyPlayingAudio,
                    isFirst: false
                };
                this.props.setCurrentAudio(playerInstance)

            }
            this.setState({selectedIndex:nextIndex});

        }else{
            if(item !== lastIndex){
                this.setState({selectedIndex:item});
            }
        }
        lastIndex = item
    };



    renderImages = () => {

        return(
            <View>
                <LeaderboardIndividualTab getTabItem={this.getTabItem} items={this.props.currentSites} itemIndex={this.state.selectedIndex}/>
            </View>
        )
    };

    menuPressed = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.toggleDrawer()
    };
    backPressed = () => {
        if(this.props.route.params.isFromHomeScreen === true){
            this.props.navigator.pop()
        }else {
            const { navigation } = this.props;
            const navigator = navigation.getNavigatorByUID('drawerNav');
            navigator.setActivateItemCustom("home",0)
        }
    };

    onDownloadSiteDataPressed = (singleDownloadObject) => {
        this.props.downloadSingleSiteAudio(singleDownloadObject)

        // let objIndex = -1;
        // this.props.allPacks.some((x,index) => {
        //
        //     if(x.languageId._id === this.props.selected_lang._id){
        //         objIndex = index
        //         return true
        //     }
        //     return false
        // });
        // debugger
        // this.props.addtoMainDownloadingQueue({
        //     type: "sites",
        //     key: "audioURL",
        //     data: this.props.allPacks[objIndex].sites[this.state.selectedIndex],
        //     objID:this.props.allPacks[objIndex]._id,
        //     objLanguage: this.props.selected_lang.language,
        //     newPacks: this.props.allPacks,
        //     objIndex: objIndex,
        //     siteIndex: this.state.selectedIndex,
        //     isFromQueue: false
        // })
        // this.props.startDownloadingQueue()
        // setTimeout(() => {
        //     this.props.downloadSitesData(this.props.allPacks[objIndex].sites[this.state.selectedIndex].audioURL,
        //         this.props.selected_lang.language,
        //         this.props.allPacks[objIndex].sites[this.state.selectedIndex]._id,this.state.selectedIndex,
        //         'audioURL',objIndex,
        //         this.props.allPacks)
        // },0)
    }

    render() {
        let languageIndex = -1
        debugger

        if(this.props.currentSites && this.props.currentSites.length > 0 && this.props.sitesAudioObject && Object.keys(this.props.sitesAudioObject).length > 0){
            languageIndex = _.findIndex(this.props.sitesAudioObject[this.props.selected_lang.language],{siteName:this.props.currentSites[this.state.selectedIndex].siteId.name})
        }

        return (
            <View style={[cs.flx1]}>
                <NavigationBar
                    navTitle={strings.Footsteps}
                    leftButtonPressed={this.backPressed}
                    leftButtonPressedMenu={this.menuPressed}
                    leftButtonType={Constant.navButtonType.menuBack}
                />

                {

                    (this.props.currentSites && this.props.currentSites.length > 0 && this.props.sitesAudioObject && Object.keys(this.props.sitesAudioObject).length > 0)?
                        <ScrollView>
                            <Player introText={this.props.currentSites[this.state.selectedIndex].displayName}
                                    transcript={(this.props.currentSites)?(this.props.currentSites[this.state.selectedIndex].transcript) ? this.props.currentSites[this.state.selectedIndex].transcript:"":""}
                                    backgroudImageURL={mainFiles[getIndex(this.props.selected_lang.language,this.props.currentSites[this.state.selectedIndex].siteId.name,"footstepImageURL")]}
                                    playerAudioURL={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].localFilePath:""}
                                    remoteAudioURL={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].siteAudioURL:""}
                                    currentlyPlaying={'footstep-'+this.state.selectedIndex+this.props.selected_lang._id}
                                    isDownload={(languageIndex > -1) ?
                                        (this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].jobID === 0) ? 0 :
                                            (this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].jobID === 'completed') ? 2 :
                                                1 : 0}
                                    isDownloadingPercentage={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].isDownloadPercentage:0}
                                    onDownloadSiteDataPressed={this.onDownloadSiteDataPressed}
                                    siteDownloadObject={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex]:{}}
                                    isFootStepComplete={this.getTabItem}/>
                            <View style={{
                                borderBottomWidth:1,
                                borderBottomColor:'lightgray',
                                marginTop:0,
                            }}>
                                <Text style={[font.MEDIUM_FONT, {color:'#000', margin:11, fontFamily:Constant.fontNotoR}]}>
                                    {(this.props.currentSites)?this.props.currentSites[this.state.selectedIndex].description:""}
                                </Text>
                            </View>

                            {this.renderImages()}
                        </ScrollView>
                        :
                        <View style={{height:'100%',width:'100%',flex: 1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={[font.MEDIUM_FONT,{ alignSelf: 'center', color:'#000',fontFamily:Constant.fontNotoB}]}>
                                {strings.noData}</Text>
                        </View>
                }
            </View>
        );
    }
}

mapStateToProps = state => {
    const { currentSites, allPacks, sitesAudioObject } = state.userLoginForm;
    const { selected_lang } = state.selectedLang;
    const { player } = state.player;

    return {
        currentSites,allPacks,selected_lang,player, sitesAudioObject
    }
};

export default connect(mapStateToProps, {
    getCurrentSites,downloadSitesData, setPlayerValues,setCurrentAudio,addtoMainDownloadingQueue,downloadSingleSiteAudio
})(FootSteps);

