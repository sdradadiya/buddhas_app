import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, TouchableOpacity,ScrollView,Alert,AsyncStorage,FlatList} from 'react-native';
import cs from '../helper/customStyles';
import {  Content,  Grid, Row, List, ListItem, } from 'native-base';
import { getPacks,setFilePath, setIntroData,downloadIntroData,downloadSitesData,startDownloadingQueue,logoutUser,addtoMainDownloadingQueue,downloadSiteAudio} from '../actions/loginAction'
import { setCurrentAudio } from '../actions/playerAction'
import { userSelectLang } from '../actions/languageAction'

import {connect} from 'react-redux';
import Constant from '../helper/constants'
import Router from '../navigationHelper/Router'
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar'
import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'
import strings from '../helper/language';
import Player from './DisplayPlayerComponent'
import Spinner from './loader'
import {introFiles} from '../helper/commonFunctions'
import _ from 'lodash'
var RNFS = require('react-native-fs');

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation
class HomeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading:false,
            showDownloading:false,
            showLanguages: false,
            packtoDownload: {},
            chngeLanguages: [],
            imageFiles:[]
        };

    }

    componentDidMount(){
        if(this.props.route.params.isFirst){
            this.getAllPacks(true)
        }else{
            this.getAllPacks(false)
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.isFocused && !this.props.isFocused) {
            debugger
            if(this.props.clearStore === true){
                this.getAllPacks(true)
            }else{
                this.getAllPacks(false)
            }

        } else if (!nextProps.isFocused && this.props.isFocused) {
        }
    }
    getAllPacks = (checkFlow) => {
       if(checkFlow){
           this.setState({
               isLoading:true
           })
       }
        this.props.getPacks(checkFlow).then((res) => {

            debugger

            this.props.setIntroData()

            if(checkFlow){
                this.checkFlow()
            }
            this.setState({
                isLoading:false
            })
        }).catch((err) => {
            this.setState({
                isLoading:false
            });
            if(err === 'user not found'){
                //logout user
                AsyncStorage.removeItem('user').then((res) => {
                    this.props.logoutUser();
                    this.props.navigator.replace(Router.getRoute('firstscreen'))
                })
            }
        })
    }

    checkDownload = (array) => {
        debugger
        if(array.length > 0){
            let isSame = !!array.reduce(function(a, b){ return (a.jobID === b.jobID) ? a : NaN; })
            if(isSame && array[0].jobID === 0){
                return true
            }
        }
        return false
    }

    checkFlow = () => {

        console.log("checking flow")
        if(this.props.currentPacks.length) {
            let objIndex = -1;
            // console.log("check length")
            this.props.currentPacks.some((pack, index) => {
                // console.log("check packsss",pack)

                if (pack.languageId._id === this.props.selected_lang._id) {
                    // console.log("Matcheddd:",this.props.selected_lang._id)
                    objIndex = index
                    return true
                }
                return false
            });

            if (objIndex > -1) {
                // console.log("obj index",objIndex)
                if (this.checkDownload(this.props.sitesAudioObject[this.props.selected_lang.language]) === true) {
                    let alertText = "You have purchased the " + this.props.selected_lang.language + " Pack. You can download it from your My Packs page at any time. Would you like to download it now?";
                    Alert.alert("",
                        alertText,
                        [
                            {text: "Download Now", onPress: () => this.downloadNow(objIndex)},
                            {text: "Download Later", onPress: () => this.noAction()},
                        ],
                        {cancelable: false}
                    );
                } else {
                    // console.log("already downloaded")

                    //continue
                    debugger
                }
            } else {
                debugger
                // console.log("language not matcheddd")

                let alertText = "The language you have selected does not match the language pack purchased. Do you want to change your language now?"

                Alert.alert("",
                    alertText,
                    [
                        {text: "Change Language", onPress: () => this.changeLanguage()},
                        {text: "Cancel", onPress: () => this.noAction()},
                    ],
                    {cancelable: false}
                );

            }
        }else{
            // console.log("no lengthhhh")
        }
    }
    downloadNow = (index) => {
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
                    this.props.downloadSiteAudio(this.props.selected_lang.language);

                    Alert.alert("Your packs is getting downloaded in background.")
                }
                else{
                    Alert.alert("Your device doesn't have enough memory space to download this file")
                }
            })

    }
    onBackToselectLanguage = () => {
        this.checkFlow()
    }
    changeLanguage = () => {

        let languages = [];
        this.props.currentPacks.map((pack,index) => {
            let a = pack.languageId;
            languages.push(a)
        });
        debugger
        if(languages.length > 0){
            //change language

            if(languages.length === 1){
                debugger
                //change laguage DirectlychangeLang
                this.props.userSelectLang(languages[0], null).then((res) =>{
                    debugger
                    this.props.navigator.replace(Router.getRoute('mainscreen'));

                    // this.setState({
                    //     isLoading: false
                    // })
                }).catch((err) => {
                    debugger
                });

            }else{
                //ask POPup
                this.props.navigator.push(Router.getRoute('changeLang',{languagesPurchased: languages,onBackToselectLanguage: this.onBackToselectLanguage}))

            }
        }else{
            //purchase atleast one pack
            Alert.alert("You need to purchase atleast one pack to continue.You can purchase it from Store.")
        }
    };
    noAction = () => {
        this.setState({
            showDownloading:false,
            showLanguages: false,
        })
    }
    gotoAllSites = () => {
        // this.props.navigator.push(Router.getRoute('sites',{isFromHomeScreen: true}));
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.setActivateItemCustom("allsites",1)

    }
    gotoFootsteps = () => {
        // this.props.navigator.push(Router.getRoute('footsteps',{isFromHomeScreen: true}));
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.setActivateItemCustom("footsteps",2)

    }
    gotoAbout = (imgPath) => {
        this.props.navigator.push(Router.getRoute('about',{isFromHomeScreen: true, authorImagePath: imgPath}));
    }
    renderImages = () => {
        return(
            <View style={styles.viewImages}>
                <TouchableHighlight style={styles.btnimages} underlayColor='transparent'
                                    onPress={() => {
                    this.gotoAllSites()
                }}>
                    <Image source={introFiles[this.props.selected_lang.language]["allSiteImage"]}
                           style={{ width: Constant.screenWidth-30, height: (Constant.screenWidth-30)/1.5,marginTop:15}}/>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='transparent'
                                    style={styles.btnimages} onPress={() => {
                    this.gotoFootsteps()
                }}>
                    <Image source={introFiles[this.props.selected_lang.language]["footstepImage"]}
                           style={{ width: Constant.screenWidth-30, height: (Constant.screenWidth-30)/1.5,marginTop:15}}/>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='transparent'
                                    style={styles.btnimages} onPress={() => {
                    this.gotoAbout(introFiles[this.props.selected_lang.language]["authorImage"])
                }}>
                    <Image source={introFiles[this.props.selected_lang.language]["authorImage"]}
                           style={{ width: Constant.screenWidth-30, height: (Constant.screenWidth-30)/1.5,marginTop:15}}/>
                </TouchableHighlight>
                <View style={{height:50}}/>
            </View>
        )

    };


    menuPressed = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.toggleDrawer()
    };
    onDownloadSiteDataPressed = () => {
        // let objIndex = -1
        // this.props.allPacks.some((x,index) => {
        //
        //     if(x.languageId._id === this.props.selected_lang._id){
        //         objIndex = index
        //         return true
        //     }
        //     return false
        // })
        // setTimeout(() => {
        //     this.props.downloadIntroData(this.props.allPacks[objIndex].languageId.introAudio,this.props.allPacks[objIndex].language,"introAudio",this.props.allPacks,objIndex)
        // },0)
    }

    renderFlatList = (item) => {
        let languageIndex = -1
        if(this.props.introductionAudioArray){
            languageIndex = _.findIndex(this.props.introductionAudioArray,{language:this.props.selected_lang.language})
        }
        if(item.index === 0){
            return(
                <Player introText={strings.introduction}
                        backgroudImageURL={introFiles[this.props.selected_lang.language]["introImage"]}
                        playerAudioURL={(languageIndex > -1)?(this.props.introductionAudioArray[languageIndex].jobID === 'completed'&&this.props.introductionAudioArray[languageIndex].localFilePath||''):""}
                        currentlyPlaying={(this.props.introduction)?'introduction-'+this.props.introduction.languageId._id:''}
                        isDownload={(languageIndex > -1) ?
                            (this.props.introductionAudioArray[languageIndex].jobID === 0) ? 0 :
                                (this.props.introductionAudioArray[languageIndex].jobID === 'completed') ? 2 :
                                    1 : 0}
                        isDownloadingPercentage={(languageIndex > -1)?this.props.introductionAudioArray[languageIndex].isDownloadPercentage:0}
                        onDownloadSiteDataPressed={this.onDownloadSiteDataPressed}
                        transcript={(this.props.introduction)?this.props.introduction.languageId.transcript?this.props.introduction.languageId.transcript:"":""}/>
            )
        }else{
            return(
                this.renderImages()
            )
        }
    }
    render() {
        // console.log("IntroImage:",(this.props.introduction)?this.props.introduction.languageId.introImage:'')
        return (
            <View style={[cs.flx1]}>
                <NavigationBar
                    navTitle={strings.home}
                    leftButtonPressed = { this.menuPressed }
                    leftButtonType = {Constant.navButtonType.menu}
                />
                <FlatList
                    data={[1,2]}
                    extraData={this.state}
                    keyExtractor={(item) => item}
                    renderItem={this.renderFlatList}
                />
                <Spinner visible={this.state.isLoading}/>
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
        alignSelf:'center',
        borderTopWidth:1,
        borderTopColor:'lightgray',
        marginTop:10
    },
    btnimages: {
    }
});

mapStateToProps = state => {
    const { clearStore,introduction,allPacks, currentPacks,allLanguages,introductionAudioArray,sitesAudioObject } = state.userLoginForm;
    const { selected_lang } = state.selectedLang;

    return {
        clearStore,introduction,allPacks,selected_lang,currentPacks,allLanguages,introductionAudioArray,sitesAudioObject
    }
};

export default connect(mapStateToProps, {
    getPacks,setFilePath,setIntroData,setCurrentAudio,downloadIntroData,userSelectLang,downloadSitesData,startDownloadingQueue,logoutUser,addtoMainDownloadingQueue,downloadSiteAudio
})(HomeScreen);


