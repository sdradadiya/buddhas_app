import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity,ScrollView  } from 'react-native';
import cs from '../helper/customStyles';
import { getUrl} from "../helper/commonFunctions";
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import Constant from '../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar'
import {connect} from 'react-redux';
import {downloadSitesData,addtoMainDownloadingQueue,downloadSingleSiteAudio} from '../actions/loginAction'
import strings from '../helper/language';
import font  from '../helper/fontsize';
import Player from './DisplayPlayerComponent'
import _ from 'lodash'
import Router from '../navigationHelper/Router'
import {mainFiles,getIndex} from "../helper/commonFunctions";

class VideoDetailed extends React.Component {

    constructor(props) {
        super(props);
        let sites = _.cloneDeep(this.props.allSites);
        this.state={
            selectedIndex:sites[this.props.index],
            allSiteData: (sites)?sites:[]
        };
        this.rendernext(sites[this.props.index])
    }

    backPressed = () => {
        this.props.navigator.pop()
    };
    menuPressed = () => {
        const { navigation } = this.props;
        debugger;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.toggleDrawer()
        // setTimeout(()=>{
        //     this.props.navigator.popToTop()
        // },10)

    };

    rendernext = (count) => {
        this.setState({
            selectedIndex : count,
        });
        let newIndex = _.findIndex(this.state.allSiteData,{_id:count._id})
        for (var i=0;i<newIndex;i++){
            this.state.allSiteData.push(this.state.allSiteData.shift());
        }
    };

    renderImages = () => {
        return(
            <View style={{
                alignSelf:'center',
                borderTopWidth:1,
                borderTopColor:'lightgray',
                marginTop:10
            }}>
                <Text style={[font.MEDIUM_FONT, {
                    fontFamily: Constant.fontNotoB,
                    textAlign: 'center',
                    padding: 7,
                    color: 'black'
                }]}>{strings.nextSite}</Text>

                {
                    this.renderImageArray()
                }
            </View>
        )
    };

    renderImageArray = () => {

        let data = [];
        if(this.state.allSiteData.length>5){
            data = _.cloneDeep(_.take(this.state.allSiteData, 5))
        }else{
            data = _.cloneDeep(this.state.allSiteData)

        }
        data.shift();
        return data.map((next, index) => {

            return (
                <TouchableOpacity key={index} style={{marginBottom:10}} onPress={() => {this.rendernext(next)}}>
                    <Image source={mainFiles[getIndex(this.props.selected_lang.language,next.siteId.name,"coverImageURL")]}
                           style={{width: Constant.screenWidth - 30, height: (Constant.screenWidth-30)/1.5}}/>
                </TouchableOpacity>
            )
        })
    };


    onDownloadSiteDataPressed = (singleDownloadObject) => {
        this.props.downloadSingleSiteAudio(singleDownloadObject)

        // let objIndex = -1
        // this.props.allPacks.some((x,index) => {
        //
        //     if(x.languageId._id === this.props.selected_lang._id){
        //         objIndex = index
        //         return true
        //     }
        //     return false
        // })
        //
        // let siteIndex = _.findIndex(this.props.allPacks[objIndex].sites,{_id: this.state.selectedIndex._id})
        // this.props.addtoMainDownloadingQueue({
        //     type: "sites",
        //     key: "audioURL",
        //     data: this.props.allPacks[objIndex].sites[siteIndex],
        //     objID:this.props.allPacks[objIndex]._id,
        //     objLanguage: this.props.selected_lang.language,
        //     newPacks: this.props.allPacks,
        //     objIndex: objIndex,
        //     siteIndex: siteIndex,
        //     isFromQueue: false
        // })
        //
        // setTimeout(() => {
        //     this.props.downloadSitesData(this.state.selectedIndex.audioURL,this.props.selected_lang.language,this.state.selectedIndex._id,siteIndex,'audioURL',objIndex,this.props.allPacks)
        // },0)
    }

    render() {

        let languageIndex = -1
        if(this.props.currentSites && this.props.currentSites.length > 0 && this.props.sitesAudioObject && Object.keys(this.props.sitesAudioObject).length > 0){
            languageIndex = _.findIndex(this.props.sitesAudioObject[this.props.selected_lang.language],{siteName:this.state.selectedIndex.siteId.name})
        }
        debugger
        console.log("siteImage",mainFiles[getIndex(this.props.selected_lang.language,this.state.selectedIndex.siteId.name,"siteImageURL")])

        debugger
        return (
            <View style={[cs.flx1]}>
                <NavigationBar
                    navTitle={(this.state.selectedIndex)?this.state.selectedIndex.displayName:''}
                    leftButtonPressed = { this.backPressed }
                    leftButtonPressedMenu = { this.menuPressed }
                    leftButtonType = {Constant.navButtonType.menuBack}
                />
                { (this.props.currentSites && this.props.currentSites.length > 0 && this.props.sitesAudioObject && Object.keys(this.props.sitesAudioObject).length > 0) ?

                <ScrollView>
                    <Player introText={(this.state.selectedIndex)?this.state.selectedIndex.displayName:strings.introduction}
                            backgroudImageURL={mainFiles[getIndex(this.props.selected_lang.language,this.state.selectedIndex.siteId.name,"siteImageURL")]}
                            transcript={(this.state.selectedIndex)?this.state.selectedIndex.transcript?this.state.selectedIndex.transcript:"":""}
                            playerAudioURL={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].localFilePath:""}
                            remoteAudioURL={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].siteAudioURL:""}
                            currentlyPlaying={(this.state.selectedIndex)?'site-'+this.state.selectedIndex.displayName+this.props.selected_lang._id:''}
                            isDownload={(languageIndex > -1) ?
                                (this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].jobID === 0) ? 0 :
                                    (this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].jobID === 'completed') ? 2 :
                                        1 : 0}
                            isDownloadingPercentage={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex].isDownloadPercentage:0}
                            onDownloadSiteDataPressed={this.onDownloadSiteDataPressed}
                            siteDownloadObject={(languageIndex > -1)?this.props.sitesAudioObject[this.props.selected_lang.language][languageIndex]:{}}/>

                    <View>
                        <Text style={[ font.MEDIUM_FONT, {color:'#000', margin:11,fontFamily: Constant.fontNotoR}]}>{this.state.selectedIndex.description}</Text>
                    </View>

                    {
                        (this.state.allSiteData.length > 1)?
                            this.renderImages()
                            :
                            <View/>
                    }

                </ScrollView>
                :
                    <View style={ {height:'100%',width:'100%',flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection:'row',}}>
                        <Text style={[font.MEDIUM_FONT,{ alignSelf: 'center', color:'#000',fontFamily:Constant.fontNotoB}]}>
                            {strings.noData}</Text>
                    </View>
                }
            </View>
        );
    }
}

mapStateToProps = state => {
    const { allPacks, currentSites,sitesAudioObject } = state.userLoginForm;
    const { selected_lang } = state.selectedLang;
    return {
        selected_lang, allPacks,currentSites,sitesAudioObject
    }
};

export default connect(mapStateToProps, {
    downloadSitesData,addtoMainDownloadingQueue,downloadSingleSiteAudio
})(VideoDetailed);