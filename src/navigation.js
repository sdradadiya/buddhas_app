import React, {Component} from 'react';
import { View, NetInfo } from 'react-native';
import Router from './navigationHelper/Router'
import {StackNavigation,NavigationStyles} from '@expo/ex-navigation';
import Player from './components/customPlayerComponent'
import { showPlayerComponent } from './actions/playerAction'
import { downloadSitesData, downloadIntroductionAudio ,downloadIntroData,resumeDownloads} from './actions/loginAction'
import {connect} from 'react-redux';
import TrackPlayer from  'react-native-track-player'
let counter = 0;

class Navigation extends Component {
  constructor(props){
    super(props);
      this.state = {
          isConnected: true,
      }
  }
  componentWillMount(){
      TrackPlayer.setupPlayer({}).then(() => {
      }).catch((err) => {
          debugger
      })

      this.props.showPlayerComponent(false)
  }
    componentDidMount() {
        const dispatchConnected = isConnected => {
            this.setState({isConnected});
            if(isConnected){
               if(counter>0){
                   this.checkDownload()
                   console.log("connected")
               }
            }
            counter++
        };
        NetInfo.isConnected.fetch().then().done(() => {
            NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
        });
    }

    componentWillReceiveProps(nextProps) {
    }
    checkDownload = () => {
        // let packs = this.props.allPacks
        // packs.some((obj,objIndex) => {
        //     if(packs[objIndex]["languageId"]["isDownloadintroAudio"] === 1){
        //         dispatch(downloadIntroData({
        //             type: "intro",
        //             key: "introAudio",
        //             object: obj,
        //             newPacks: packs,
        //             objIndex: objIndex,
        //             objID:obj._id
        //         }))
        //     }
        // })
        this.props.downloadIntroductionAudio()
        this.props.resumeDownloads()

    }

    render(){
    return(
        <View style={{flex:1,marginBottom:(this.props.showPlayer)&&50||0}}>
        <StackNavigation initialRoute={Router.getRoute('firstscreen')}
                         navigatorUID="mainNav"
                         navigatorId="mainNav"
                         defaultRouteConfig={{
                             navigationBar: {
                                 visible: false,
                             },
                             styles: {
                                 ...NavigationStyles.SlideHorizontal,
                                 gestures: null,
                             }
                         }}/>

                <Player heightOfPlayer={(this.props.showPlayer)&&50||0}/>
        </View>
    );
  }
}

mapStateToProps = state => {
    const { showPlayer } = state.player;
    const { clearStore,introduction,allPacks, currentPacks,allLanguages } = state.userLoginForm;

    return {
        showPlayer,currentPacks,allPacks
    }
};

export default connect(mapStateToProps, {
    showPlayerComponent,downloadSitesData, downloadIntroductionAudio,downloadIntroData,resumeDownloads
})(Navigation);

