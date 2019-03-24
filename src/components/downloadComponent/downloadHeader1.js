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
        if(array.length > 0){
            let isSame = !!array.reduce(function(a, b){ return (a.isDownload === b.isDownload) ? a : NaN; })

            if(isSame && array[0].isDownload === 2){
                return true
            }
        }
        return false
    }
    componentWillReceiveProps(nextProps) {
        let isDownloadAll = this.checkDownload(nextProps.packData[0].sites)
        if(isDownloadAll){
            this.props.backPressed()
        }
    }
        renderComponents = (Packs) => {

        return Packs.map((pack,packindex) => {
debugger
            return (
                <View style={{marginTop:5,padding:20, backgroundColor: 'white'}}>

                    <View style={{padding:10,width:'100%',borderBottomWidth:0.5,borderBottomColor:'lightgray',justifyContent:'space-between',flexDirection:'row'}}>
                        <Text style={[font.XMEDIUM_FONT,{color:'#000',fontFamily:Constant.fontNotoB}]}>
                            {pack.name}
                        </Text>
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
            return (
                <TouchableHighlight onPress={() => {
                }}
                                    underlayColor='transparent'>
                    <View style={{padding:10,width:'100%',borderBottomWidth:0.5,borderBottomColor:'lightgray',flexDirection:'row',alignItems:'center'}}>
                        {
                            (site.isDownload === 1)?
                                <Progress.Pie progress={(site.isDownloadingPercentage)?site.isDownloadingPercentage:0} size={17} animated={true} color={'#2CAAD9'} borderWidth={3}/>
                                :
                                <Icon
                                    size={18}
                                    //0: 'not downloaded'
                                    //1: 'isDownloading'
                                    //2: 'downloaded'
                                    name={(site.isDownload !== 0) ? 'check-circle' : 'download'}
                                    type='font-awesome'
                                    color={(site.isDownload !== 0)?'#50A91B':'#2CAAD9'}
                                />

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
debugger
        return (
            <View>
                {
                    this.renderComponents((this.props.packData)?this.props.packData:[])
                }
            </View>
        );
    }
}

mapStateToProps = state => {
    return {
        selected_lang: state.selectedLang.selected_lang
    }
};

export default connect(mapStateToProps, {
    clearStoreData
})(Settings);

