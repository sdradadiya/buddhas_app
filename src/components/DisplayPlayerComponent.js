import React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity,TouchableHighlight,DeviceEventEmitter} from 'react-native';
import {Content, Grid, Row, List, ListItem,} from 'native-base';
import Constant from '../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import strings from '../helper/language';
import {showAlert, getUrl} from '../helper/commonFunctions';
import font  from '../helper/fontsize';
import Router from '../navigationHelper/Router';
import {Icon,Slider} from 'react-native-elements';
var currentAudio = '';
import { setCurrentAudio, setPlayerValues, showPlayerComponent } from '../actions/playerAction'
var RNFS = require('react-native-fs');

import {connect} from 'react-redux';
import * as Progress from 'react-native-progress';
var currentT = 0;
var durationT = 0;
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


class DisplayPlayerComponent extends React.Component {

    constructor(props) {
        super(props);
        if (this.props.playerAudioURL && this.props.playerAudioURL !== "") {
            if(this.props.playerAudioURL === "You need to purchase the pack"){
                // showAlert("You need to purchase the pack")
            }else {
                currentAudio = this.props.playerAudioURL
            }
        }
        this.state = {
            imagePath: this.props.backgroudImageURL,
            siteText: this.props.introText,
            siteTranscript: this.props.transcript,
            currentlyPlaying: this.props.currentlyPlaying,
            sliderVal: 0
        };
        this.draggingSlider = false
    }

    componentWillReceiveProps(nextProps) {


        this.setState({
            imagePath: nextProps.backgroudImageURL,
            siteText: nextProps.introText,
            siteTranscript: nextProps.transcript,
            // currentlyPlaying: nextProps.currentlyPlaying
        })
        if (nextProps.playerAudioURL && nextProps.playerAudioURL !== "") {

            this.setState({
                imagePath: nextProps.backgroudImageURL,
                siteText: nextProps.introText,
                siteTranscript: nextProps.transcript,
                currentlyPlaying: nextProps.currentlyPlaying
            })
        }else{
            this.setState({
                notPurchased:true
            })
        }
        if (nextProps.isFocused) {
            if(this.props.player.currentlyPlayingAudio && this.props.player.currentlyPlayingAudio !== this.state.currentlyPlaying) {

                TrackPlayer.getState().then((state) => {
                    if(state === Constant.playingState){
                        this.props.showPlayerComponent(true)
                    }
                })
            }else{
                this.props.showPlayerComponent(false)
            }
        }
    }
    renderIcon() {

        if(this.props.player.currentlyPlayingAudio && this.props.player.currentlyPlayingAudio === this.state.currentlyPlaying) {
            return (
                <TouchableOpacity style={{height:50,justifyContent:'center'}} onPress={() => {
                    this.props.setPlayerValues({ prop: 'playingAudio', value: !this.props.player.playingAudio})
                }}>
                    <Icon
                        size={25}
                        style={{alignSelf:'center'}}
                        name={(this.props.player.playingAudio)&&'pause'||'play-arrow'}/>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity style={{height:50,justifyContent:'center'}} onPress={() => {
                this.playSound()
            }}>
                <Icon
                    size={25}
                    style={{alignSelf:'center'}}
                    name={'play-arrow'}/>
            </TouchableOpacity>

        )
    }

    playSound() {

        if (this.props.playerAudioURL && this.props.playerAudioURL !== "") {

            let playerInstance = {
                playerURL: this.props.playerAudioURL,
                playerImage: this.state.imagePath,
                playerText: this.state.siteText,
                currentTime: 0,
                duration: 0,
                seekTotime: 0,
                playingAudio: true,
                currentlyPlayingAudio: this.state.currentlyPlaying,
                isFirst: false
            };

            this.props.setCurrentAudio(playerInstance)

        } else {
            showAlert("You need to purchase the pack")
        }
    }
    getCurrentTimePercentage() {
        if (this.props.player.currentTime > 0) {
            return parseFloat(this.props.player.currentTime) / parseFloat(this.props.player.duration);
        } else {
            return 0;
        }
    }
    readTrascript = (title,details) => {
        
        this.props.navigator.push(Router.getRoute("transcript",{title:title,transcript: details}));
    }
    gotoStore = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.setActivateItemCustom("store",3)
    }
    renderPlayerBar = (opt) => {
        switch (opt) {
            case 0:
                return(
                    <TouchableHighlight style={{height:'100%',justifyContent:'center'}} underlayColor='transparent'
                                        onPress={() => {
                                            debugger
                                            if(this.props.remoteAudioURL){
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
                                                            setTimeout(() => {
                                                                this.props.onDownloadSiteDataPressed(this.props.siteDownloadObject)
                                                            },0)
                                                        }
                                                        else{
                                                            Alert.alert("Your device doesn't have enough memory space to download this file")
                                                        }
                                                    })
                                            }else{
                                                this.gotoStore()
                                            }

                                        }}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            {this.props.remoteAudioURL ?
                                <Text style={[font.TEXTBOX_FONT, {color:'#000',marginRight:10, fontFamily:Constant.fontNotoR}]}>
                                    {"Download"}
                                </Text>:
                                <View>
                                    <Text style={[font.TEXTBOX_FONT, {color:'#000',marginRight:10, fontFamily:Constant.fontNotoR}]}>
                                        {"Please Purchase a Pack "}
                                    </Text>
                                    <Text style={[font.TEXTBOX_FONT, {color:'rgb(66,133,244)',marginRight:10,textAlign:'center', fontFamily:Constant.fontNotoR}]}>
                                        {" Visit Store"}
                                    </Text>
                                </View>
                            }
                            {this.props.remoteAudioURL ?
                                <Icon
                                    size={20}
                                    name={'download'}
                                    type='font-awesome'
                                    color='#000'
                                    underlayColor='transparent'
                                    onPress={() => {

                                    }}/> : <View/>
                            }
                        </View>
                    </TouchableHighlight>
                );
            case 1:
                return(
                    <TouchableHighlight underlayColor='transparent'
                                        onPress={() => {
                                            // if(site.isDownload === 0){
                                            //    this.props.onDownloadSiteDataPressed(site,siteindex,packObj,packIndex)
                                            // }else{
                                            //     console.log("Already downloaded")
                                            // }
                                        }}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={[font.TEXTBOX_FONT, {color:'#000',marginRight:10, fontFamily:Constant.fontNotoR}]}>
                                Downloading
                            </Text>
                            <Progress.Pie progress={this.props.isDownloadingPercentage/100} size={17} animated={true} color={'#000'} borderWidth={3}/>
                        </View>
                    </TouchableHighlight>
                );
            case 2:

                if(this.props.player.currentlyPlayingAudio && this.props.player.currentlyPlayingAudio !== this.state.currentlyPlaying) {
                    //reset player
                    currentT = 0;
                    durationT = 0;
                    time=0
                    // this.props.showPlayerComponent(true)

                }else{
                    // this.props.showPlayerComponent(false)

                    currentT = this.props.player.currentTime
                    durationT = this.props.player.duration
                    if(this.draggingSlider === true){
                        time=durationT-this.state.sliderVal
                    }else{
                        time=durationT-currentT
                    }

                }
                return(
                    <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'center'}}>

                        {
                            this.renderIcon()
                        }
                        <View style={{flex:1,flexDirection:'row',marginLeft:3,marginRight:3}}>
                            <Text style={{ position:'absolute',fontSize:13, color: '#000',textAlign:'center',alignSelf:'center',bottom:1,left:0,right:0}}>
                                { ((time)>0)?'- '+Math.floor((time)/60)+':'+('0' + (Math.floor((time)%60))).slice(-2):"0:00" }
                            </Text>

                            <Slider
                                step={0.01}
                                disabled={false}
                                style={{ flex:1 }}
                                minimumValue={0}
                                maximumValue={durationT}
                                value={currentT}
                                thumbTintColor={'#0CB2F6'}
                                thumbStyle={{width:11,height:11}}
                                thumbTouchSize={{width: 25, height: 25}}
                                onValueChange={val => {
                                    console.log("seek Custom:",parseInt(val))
                                    // TrackPlayer.seekTo(this.getCurrentTimeValue(val))
                                    // this.props.setPlayerValues({ prop: 'seekTotime', value: val})
                                    this.setState({
                                        sliderVal:val
                                    })
                                }}
                                onSlidingStart={() => {
                                    this.draggingSlider = true
                                }}
                                onSlidingComplete={(val) => {
                                    this.draggingSlider = false
                                    TrackPlayer.seekTo(val)
                                }}
                            />

                        </View>
                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center',height:50,marginLeft:15}} onPress={() => {
                            let title = (this.state.siteText)?this.state.siteText:strings.introduction
                            let detail = (this.state.siteTranscript)?this.state.siteTranscript:""
                            this.readTrascript(title,detail)
                        }}>
                            <Image source={require('../../images/file-document.png')} style = {{
                                width: 20,
                                height: 20,
                                alignSelf:'center'
                            }} />
                        </TouchableOpacity>

                    </View>

                );
            case 3:
                return(
                    <TouchableHighlight underlayColor='transparent'
                                        onPress={() => {
                                            // if(site.isDownload === 0){
                                            //    this.props.onDownloadSiteDataPressed(site,siteindex,packObj,packIndex)
                                            // }else{
                                            //     console.log("Already downloaded")
                                            // }
                                        }}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <Text style={[font.TEXTBOX_FONT, {color:'red',marginRight:10, fontFamily:Constant.fontNotoR}]}>
                                In Queue
                            </Text>
                            <Icon
                                size={20}
                                name={'ban'}
                                type='font-awesome'
                                color='red'
                                underlayColor='transparent'
                                onPress={() => {

                                }}/>
                        </View>
                    </TouchableHighlight>
                );

        }
    }

    render() {
        console.log("Remote URLLLLLLL",this.props.remoteAudioURL)
        return (
            <View style={styles.container}>
                <Image source={this.state.imagePath}
                       style={{ width: Constant.screenWidth,  height: Constant.screenWidth/1.5, }}/>
                <View style={styles.outerView}>
                    <Text style={[font.TEXTBOX_FONT, {color:'#000', fontFamily:Constant.fontNotoB,marginRight:20}]}>
                        {(this.state.siteText)?this.state.siteText:strings.introduction}
                    </Text>
                    {
                        this.renderPlayerBar((this.props.remoteAudioURL !== '')?this.props.isDownload:0)
                    }
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor: '#cccccc'
    },
    progress: {
        flex: 1,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor:'blue'
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
    container: {
        //flex: 1,
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    viewImages: {
        alignSelf: 'center',
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
        marginTop: 10
    },
    btnimages: {}
});
mapStateToProps = state => {
    const { player } = state.player;
    return {
        player
    }
};

export default connect(mapStateToProps, {
    setCurrentAudio,setPlayerValues, showPlayerComponent
})(DisplayPlayerComponent);



