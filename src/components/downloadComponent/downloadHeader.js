import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight, ActivityIndicator,TextInput,ScrollView ,
    FlatList,Dimensions,AsyncStorage } from 'react-native';
import Constant from '../../helper/constants'
import {NavigationStyles} from '@expo/ex-navigation';
import font  from '../../helper/fontsize';
import {connect, } from 'react-redux';
import {clearStoreData} from '../../actions/loginAction'
import {Icon} from 'react-native-elements';
import * as Progress from 'react-native-progress';

const h=Dimensions.get('window').height;

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state={
            isLoading: false,
            selectedLanguage: this.props.selected_lang
        }
    }

    checkDownload = (array) => {
        if(array && array.length > 0){
            let isSame = !!array.reduce(function(a, b){ return (a.jobID === b.jobID) ? a : NaN; })
            if(isSame && array[0].jobID === 0){
                return true
            }
        }
        return false
    }
    renderComponents = (Packs) => {
        return Packs.map((pack,packindex) => {

            let isDownloadAll = this.checkDownload(this.props.sitesAudioObject[pack.language])

            return (
                <View style={{marginTop:5,padding:20, backgroundColor: 'white'}}>

                    <View style={{padding:10,width:'100%',borderBottomWidth:0.5,borderBottomColor:'lightgray',justifyContent:'space-between',flexDirection:'row'}}>
                        <Text style={[font.XMEDIUM_FONT,{color:'#000',fontFamily:Constant.fontNotoB}]}>
                            {pack.name}
                        </Text>
                        <Icon
                            size={20}
                            name={(isDownloadAll)?'download':'trash'}
                            type='font-awesome'
                            color='#000'
                            underlayColor='transparent'
                            onPress={() => {

                                this.props.onDownloadOrDeletePressed((isDownloadAll)?'download':'delete',pack, packindex)
                            }} />

                    </View>
                    {
                        this.renderSubComponents(pack,packindex)
                    }
                </View>

            )
        })
    }
    renderSubComponents = (packObj,packIndex) => {
        return packObj.sites.map((site,siteindex) => {
            let index = _.findIndex(this.props.sitesAudioObject[packObj.language],{siteName: site.siteId.name})
            return (
                <TouchableHighlight onPress={() => {
                    if(this.props.sitesAudioObject[packObj.language][index].jobID === 0){
                        debugger
                        this.props.onDownloadSiteDataPressed(site,siteindex,packObj,packIndex,this.props.sitesAudioObject[packObj.language][index])
                    }else{
                        console.log("Already downloaded")
                    }
                }}
                                    underlayColor='transparent'>
                    <View style={{padding:10,width:'100%',borderBottomWidth:0.5,borderBottomColor:'lightgray',flexDirection:'row',alignItems:'center'}}>
                        {
                            (this.props.sitesAudioObject[packObj.language][index].jobID === 0 || this.props.sitesAudioObject[packObj.language][index].jobID === 'completed')?
                                <Icon
                                    size={18}
                                    //0: 'not downloaded'
                                    //1: 'isDownloading'
                                    //2: 'downloaded'
                                    name={(this.props.sitesAudioObject[packObj.language][index].jobID === 0) ? 'download':'check-circle'}
                                    type='font-awesome'
                                    color={(this.props.sitesAudioObject[packObj.language][index].jobID === 0)?'#2CAAD9':'#50A91B'}
                                />
                                :
                                <Progress.Pie
                                    progress={(this.props.sitesAudioObject[packObj.language][index].isDownloadPercentage && this.props.sitesAudioObject[packObj.language][index].isDownloadPercentage !== 0)
                                    ?(this.props.sitesAudioObject[packObj.language][index].isDownloadPercentage/100):0} size={17} animated={true} color={'#2CAAD9'} borderWidth={3}/>
                                                    }

                        <Text style={[font.MEDIUM_FONT,{color:'#000',fontFamily:Constant.fontNotoR,marginLeft:50}]}>
                            {site.displayName}
                        </Text>
                    </View>
                </TouchableHighlight>
            )
        })
    }

    render() {

        return (
            <View>
                {
                    (this.props.currentPacks && this.props.currentPacks.length > 0 && this.props.sitesAudioObject && Object.keys(this.props.sitesAudioObject).length > 0)?

                        this.renderComponents((this.props.packData)?this.props.packData:[]):
                        <View/>
                }
            </View>
        );
    }
}

mapStateToProps = state => {

    return {
        selected_lang: state.selectedLang.selected_lang,
        sitesAudioObject: state.userLoginForm.sitesAudioObject,
        currentPacks: state.userLoginForm.currentPacks
    }
};

export default connect(mapStateToProps, {
    clearStoreData
})(Settings);

