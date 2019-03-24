import React from 'react';
import {Image, Text, View, StyleSheet, TouchableOpacity,DeviceEventEmitter, Animated} from 'react-native';
import {Content, Grid, Row, List, ListItem,} from 'native-base';
import Constant from '../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import strings from '../helper/language';
import {showAlert, getUrl} from '../helper/commonFunctions';
import font  from '../helper/fontsize';
import {Icon,Slider} from 'react-native-elements';
import TrackPlayer from 'react-native-track-player';
import { setCurrentAudio, setPlayerValues, showPlayerComponent } from '../actions/playerAction'
import {connect} from 'react-redux';
import footstep from '../components/footSteps'

var currentT = 0;
var durationT = 0;

class CustomPlayerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isReadyToPlay: false,
            sliderVal: 0
        };
        this.draggingSlider = false;
        this.position = new Animated.ValueXY(0,Constant.screenHeight);
    }
    componentWillMount(){
        Animated.timing(this.position, {
            toValue: {x:0, y:Constant.screenHeight}, duration:0
        }).start();

    }
    componentDidMount(){

        this.props.setCurrentAudio({
            playerURL: '',
            playerImage: '',
            playerText: '',
            currentTime: 0,
            duration: 0,
            seekTotime: 0,
            playingAudio: false,
            isFirst: false,
            currentlyPlayingAudio: '',
        })
        TrackPlayer.eventEmitter.addListener('remote-pause', (res) => {
            TrackPlayer.pause();

        });
        TrackPlayer.eventEmitter.addListener('remote-play', (res) => {
            TrackPlayer.play();
        });
        TrackPlayer.eventEmitter.addListener('remote-seek-forward', (res) => {
            if(res){
                TrackPlayer.seekTo(res);
            }
        });
        TrackPlayer.eventEmitter.addListener('playback-state', (res) => {
        });
        TrackPlayer.eventEmitter.addListener('playback-track-changed', (res) => {
        });
        TrackPlayer.eventEmitter.addListener('playback-error', (err) => {
        });
        TrackPlayer.eventEmitter.addListener('playback-progress', (err) => {
        });
        TrackPlayer.eventEmitter.addListener('playback-track-ended', (err) => {
            if(this.props.player.currentlyPlayingAudio.indexOf('footstep') >= 0){
                debugger
                this.clearTimer();
                this.props.setPlayerValues({ prop: 'footStep', value: -30})
            }else {
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
                //
                this.props.setCurrentAudio(playerInstance)
                this.clearTimer();
            }

        });

    }

    componentWillReceiveProps(nextProps) {

        // show animation on player
        let bottomPlayerHeight = nextProps.heightOfPlayer
        if(Constant.ANDROID && nextProps.heightOfPlayer === 50){
            bottomPlayerHeight = 75
        }
        Animated.timing(this.position, {
            toValue: {x:0, y:Constant.screenHeight-bottomPlayerHeight}, duration:300
        }).start();

        //check which audio is playing
        if (this.props.player.playerURL !== nextProps.player.playerURL) {
            if(nextProps.player.playerURL !== '') {
                let player = this.setNewPlayer(getUrl(nextProps.player.playerURL),nextProps.player.playerImage);
            }
        }

        if (this.props.player.playingAudio !== nextProps.player.playingAudio) {
            this.onPlayPausePressed()
        }
    }

    async setPlayer(url,img){
        console.log("settingPlayer with URL:",url)
        debugger
        TrackPlayer.reset()
        var track = {
            id: '01',
            url: url,
            title: 'ITFB',
            artist: 'Buddhas',
            artwork: img, // Load artwork from the app bundle
        };
        await TrackPlayer.add(track);
debugger
        // Starts playing it
        TrackPlayer.play();
        console.log("playiiinnnnnggggggggg")
        this.setState({isReadyToPlay:true});

        this.setTimer()
    }
    async setNewPlayer(url,image){
        debugger
        if(url !== ''){
            // TrackPlayer.setupPlayer({}).then(() => {
            //     debugger
                let p = this.setPlayer(url,image);
                TrackPlayer.updateOptions({
                    capabilities: [
                        TrackPlayer.CAPABILITY_PLAY,
                        TrackPlayer.CAPABILITY_PAUSE
                    ],
                });
            // }).catch((err) => {
            //     debugger
            // })
        }
    }
    onPlayPausePressed = () => {
        debugger
        if(this.state.isReadyToPlay){
            if(this.props.player.playingAudio){

                TrackPlayer.pause()
                this.clearTimer();
            }else {
                if(this.props.player.currentTime === 0){
                    let player = this.setNewPlayer(getUrl(this.props.player.playerURL),this.props.player.playerImage);
                }else {
                    TrackPlayer.play();
                    this.setTimer()
                }
            }
        }
    };
    setTimer() {
        let interval1Id =  setInterval(() => {
            this.getCurrentTime()
        }, 1000);
        this.setState({
            interval1Id: interval1Id,
        });
    }
    clearTimer() {
        if(this.state.interval1Id) {
            clearInterval(this.state.interval1Id);
        }
    }


    getCurrentTime = () => {
        let audioDuration = 0;
        TrackPlayer.getState().then((state) => {
            if(Constant.ANDROID)
            {
                if (state) {
                    console.log("fdsfsdfsd",state)
                    this.playerStatusChanged(state)
                }
            }
        });
        TrackPlayer.getDuration().then((duration) => {
            if (duration) {
                audioDuration = duration;
            }
        });
        TrackPlayer.getPosition().then((currentTime) => {
            if (currentTime) {
                this.props.setPlayerValues({ prop: 'currentTime', value: currentTime})
                this.props.setPlayerValues({ prop: 'duration', value: audioDuration})
            }
        });
    };

    playerStatusChanged = (state) => {
        debugger
        if(state === 1) {
            debugger
            if(this.props.player.currentlyPlayingAudio.indexOf('footstep') >= 0){
                debugger
                this.clearTimer();
                this.props.setPlayerValues({ prop: 'footStep', value: -30})
            }else {
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
                // this.props.setPlayerValues({ prop: 'playingAudio', value: false})
                // this.props.setPlayerValues({ prop: 'currentTime', value: false})
                // this.props.setPlayerValues({ prop: 'duration', value: false})
                // this.props.setPlayerValues({ prop: 'seekTotime', value: false})
                //
                this.props.setCurrentAudio(playerInstance)
                // this.setInitialPlayer(getUrl(this.props.player.playerURL));
                this.clearTimer();
            }

        }else if(state === 2){
            this.props.setPlayerValues({ prop: 'playingAudio', value: false})
            this.clearTimer();
            console.log(state);
            console.log("clear timerrrrrr");
        }
    };

    renderIcon() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.setPlayerValues({ prop: 'playingAudio', value: !this.props.player.playingAudio})
            }}>
                <Icon
                    name={(this.props.player.playingAudio)&&'pause'||'play-arrow'}/>
            </TouchableOpacity>
        )
    }

    getCurrentTimePercentage() {
        if (this.props.player.currentTime > 0) {
            return parseFloat(this.props.player.currentTime) / parseFloat(this.props.player.duration);
        } else {
            return 0;
        }
    }

    getCurrentTimeValue(flexValue) {
        return (this.props.player.duration)*flexValue
    }

    renderCustomPlayer = () => {
        currentT = this.props.player.currentTime
        durationT = this.props.player.duration
        if(this.draggingSlider === true){
            time=durationT-this.state.sliderVal
        }else{
            time=durationT-currentT
        }
        // time=this.state.sliderVal
// time=durationT-currentT+(currentT-this.props.player.seekTotime)
        return (
            <Animated.View style={[{
                position:'absolute',
                height:this.props.heightOfPlayer,
                bottom:0,
                left:0,
                right:0,
                backgroundColor: 'red',
                zIndex:10,
            },            this.position.getLayout()
            ]}>
                <View style={styles.outerView}>
                    <Image source={this.props.player.playerImage}
                           style={{ width: 30,  height: 30,margin:7 }}/>
                    <Text style={[font.TEXTBOX_FONT, {marginRight:15,color:'#000', fontFamily:Constant.fontNotoB}]}>
                        {(this.props.player.playerText)?this.props.player.playerText:strings.introduction}
                    </Text>
                    <View>
                        {this.renderIcon()}
                    </View>

                    <View style={styles.progress}>
                        <Slider
                            step={0.01}
                            disabled={false}
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
                    <Text style={{ fontSize:13, color: '#000', padding:5 }}>
                        { ((time)>0)?'- '+Math.floor((time)/60)+':'+('0' + (Math.floor((time)%60))).slice(-2):"0:00" }
                    </Text>
                </View>
            </Animated.View>
        );
    };


    render() {
        return this.renderCustomPlayer()
    }
}

const styles = StyleSheet.create({
    outerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#cccccc',
        height: 50,

    },
    progress: {
        flex: 1,
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
    backgroundVideo: {
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
});

mapStateToProps = state => {
    const { player } = state.player;
    return {
        player
    }
};

export default connect(mapStateToProps, {
    setCurrentAudio, setPlayerValues,showPlayerComponent
})(CustomPlayerComponent);



