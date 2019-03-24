import {
    USER_LOGIN_UPDATE,
    APP_SET_USER_DATA,
    LOGIN_SUCCESS,
    PASSWORD_CHANGE_UPDATE,
    PASSWORD_CHANGE,
    SET_PACK_DATA,
    SET_CURRENT_PACK_DATA,
    SET_CURRENT_SITE_DATA,
    SET_INTRODUCTION_DATA,
    CLEAR_DATA,
    SET_STORE_DATA,
    SET_LANGUAGE_DATA,
    SET_DOWNLOAD_QUEUE,
    SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
    SET_SITES_AUDIO_DOWNLOAD_DATA
} from './types'
import {AsyncStorage,Alert} from 'react-native';
import API_CONSTANTS from '../helper/apiConstants'
import {userRegisterUpdate} from "./registerAction";
import {setCurrentAudio,showPlayerComponent} from "./playerAction";
import Constant from '../helper/constants'
import axios from 'axios'
import RNFetchBlob from 'react-native-fetch-blob'
var RNFS = require('react-native-fs');
import strings from '../helper/language';

import _ from 'lodash'
import TrackPlayer from 'react-native-track-player'
let counter = 0;
let percentage = 0
let introPercentage = 0
let jobId = -1;
export const userLoginUpdate = ({ prop, value }) => {
    return {
        type: USER_LOGIN_UPDATE,
        payload: { prop, value }
    }
};

export const userLogin = (email, password, isLogin) => {
    return (dispatch, getState) => {
        return getUserCountry().then((res) => {
            let body = {
                email: email,
                password: password,
                location:  res,
                platform: (Constant.IOS) ? 'IOS' : 'Android'
            };
            debugger
            let url = '';
            if (isLogin) {
                url = API_CONSTANTS.baseUrl + API_CONSTANTS.login
            } else {
                url = API_CONSTANTS.baseUrl + API_CONSTANTS.changePassword
            }
            return axios.post(url, body)
                .then((response) => {
                    debugger
                    AsyncStorage.setItem('user', JSON.stringify({email: email, password: password}));
                    dispatch({
                        type: APP_SET_USER_DATA,
                        payload: response.data,
                    });
                    dispatch({
                        type: PASSWORD_CHANGE,
                        payload: 'password change successfully',
                    });
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: "successful"
                    });
                    return Promise.resolve({message: 'Login SuccessFull'})
                })
                .catch((e) => {
                    debugger
                    if (e.response && e.response.data) {
                        AsyncStorage.clear();
                        dispatch({
                            type: LOGIN_SUCCESS,
                            payload: "unsuccessful"
                        });
                        dispatch(userLoginUpdate({prop: 'password', value: ''}));

                        return Promise.reject({message: e.response.data.error})
                    } else {
                        return Promise.reject({message: "Network Error", isNetworkError: true})
                    }
                });

        });
    };
}

export const userPasswordUpdate = ({ prop, value }) => {
    return {
        type: PASSWORD_CHANGE_UPDATE,
        payload: { prop, value }
    }
}

export const checkMail = (email) => {
    return (dispatch, getState) => {

        return axios.get(API_CONSTANTS.baseUrl+API_CONSTANTS.checkMailAPI+email)
            .then((response) => {

                return Promise.resolve(response.data)
            })
            .catch((e) => {


                console.log('catch error API', e);
                if (e.response.data.error){
                    return Promise.reject(e.response.data.error);
                }else {
                    return Promise.reject(Constant.ServerError)
                }
                throw new Error(e);
            });

    };
};
export const forgotPassword = (email) => {
    return (dispatch, getState) => {

        return axios.get(API_CONSTANTS.baseUrl+API_CONSTANTS.forgotPassword+email)
            .then((response) => {

                return Promise.resolve(response.data)
            })
            .catch((e) => {


                console.log('catch error API', e);
                if (e.response.data.error){
                    return Promise.reject(e.response.data.error);
                }else {
                    return Promise.reject(Constant.ServerError)
                }
                throw new Error(e);
            });

    };
};
export const getAllLanguages = () => {
    return (dispatch, getState) => {
        debugger
        return axios.get(API_CONSTANTS.baseUrl+API_CONSTANTS.getLanguages)
            .then((response) => {
debugger
                dispatch({
                    type:SET_LANGUAGE_DATA,
                    payload: response.data
                })
                return Promise.resolve(response.data)
            })
            .catch((e) => {
                debugger
                console.log('catch error', e);
                if (e.response.data.error){
                    return Promise.reject(e.response.data.error);
                }else {
                    return Promise.reject(Constant.ServerError)
                }
                throw new Error(e);
            });
    };
};

export const setStorePack = (storePacks) => {
    return {
        type:SET_STORE_DATA,
        payload:storePacks
    }
}


export const getStorePacks = (userPacks) => {

    return (dispatch, getState) => {
        return axios.get(API_CONSTANTS.baseUrl+API_CONSTANTS.getPacks+getState().userLoginForm.user._id,{headers:{"authorization":getState().userLoginForm.token}})
            .then((response) => {
                debugger
                let currentPacks = []
                if(userPacks){
                    currentPacks = userPacks
                }else {
                    currentPacks = getState().userLoginForm.user.packs

                }                // let oldStorePacks = getState().userLoginForm.storePacks
                let lang = getState().selectedLang.selected_lang._id
                let storePacks = []
                response.data.map((pack) => {
                    let packobj = {};

                    if(pack.languageId && pack.languageId._id === lang){
                        packobj.isSelected = true;
                    }
                    else {
                        packobj.isSelected = false;
                    }
                    let sites = []
                    pack.sites.map((site) => {
                        sites.push(site.displayName);
                    })
                    let index = _.findIndex(currentPacks, { 'packId':{'_id':pack._id}});

                    let owned = false
                    if(index>-1){
                        owned = true
                    }
                    packobj.name = pack.name;
                    packobj.price = '$'+pack.price.toString();
                    packobj._id = pack._id
                    packobj.isOwned = owned
                    packobj.includedSites = sites.join(',');
                    packobj.packIdAndroid=pack.androidId
                    packobj.packIdIOS=pack.iosId

                    storePacks.push(packobj);
                })
                dispatch(setStorePack(storePacks))

                return Promise.resolve(storePacks);
            })
            .catch((e) => {
                debugger
                console.log('catch error getStorePacks', e);
                if (e.response.data.error){
                    return Promise.reject(e.response.data.error);
                }else {

                    return Promise.reject(Constant.ServerError)
                }
                throw new Error(e);
            });

    };
};
// setIntroDownloadOption = (oldPacksObject,newPackId,key) => {
//     //0: 'not downloaded'
//     //1: 'isDownloading'
//     //2: 'downloaded'
//
//     if(oldPacksObject){
//         let pack = _.find(oldPacksObject,{_id: newPackId})
//         if(pack){
//             if(pack["languageId"][key] && pack["languageId"][key] !== ""){
//                 if(pack["languageId"]["isDownloadintroAudio"] && pack["languageId"]["isDownloadintroAudio"] === 1){
//                     return 1
//                 }
//                 if (pack["languageId"][key].substring(0, 7) === "file://") {
//                     return 2
//                 }
//             }
//         }
//     }
//     return 0
// }
// setDownloadOption = (oldPacksObject,newPackId,newPackSiteId,newPackAudioURL) => {
//     //0: 'not downloaded'
//     //1: 'isDownloading'
//     //2: 'downloaded'
//     // debugger
//     if(oldPacksObject){
//         let pack = _.find(oldPacksObject,{_id: newPackId})
//         if(pack){
//             let site = _.find(pack.sites,{_id: newPackSiteId})
//             if(site){
//
//                 if(newPackAudioURL && newPackAudioURL !== ''){
//                     if(site.audioURL && site.audioURL !== ""){
//                         if (site.isDownload && (site.isDownload === 1 || site.isDownload === 3)) {
//                             return site.isDownload
//                         }
//                         if (site.audioURL.substring(0, 7) === "file://") {
//                             return 2
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return 0
// }
// setDownloadOptionSiteImages = (oldPacksObject,newPackId,newPackSiteId,key) => {
//     //0: 'not downloaded'
//     //1: 'isDownloading'
//     //2: 'downloaded'
//
//
//     if(oldPacksObject){
//         let pack = _.find(oldPacksObject,{_id: newPackId})
//         if(pack){
//             let site = _.find(pack.sites,{_id: newPackSiteId})
//             if(site){
//                 if(site[key] && site[key] !== ""){
//                     if (site["isDownload"+key] && site["isDownload"+key] === 1) {
//                         return 1
//                     }
//                     if (site[key].substring(0, 7) === "file://") {
//                         return 2
//                     }
//                 }
//             }
//         }
//     }
//     return 0
// }
//
// export const setDownloadingQueue = (packIndex) => {
//     return (dispatch,getState) => {
//         let obj = getState().userLoginForm.currentPacks[packIndex]
//         let allPackInex = _.findIndex(getState().userLoginForm.allPacks,{_id:obj._id});
//         let flag = false
//         // packs.some((obj,objIndex) => {
//         //     debugger
//         obj.sites.some((data,index) => {
//             if(data.audioURL){
//                 if(obj["sites"][index]["isDownload"] === 0){
//                     counter = Math.random()
//                     dispatch(downloadSitesData(data.audioURL,obj.language,data._id,index,'audioURL',allPackInex,getState().userLoginForm.allPacks,true,counter))
//                     flag = true
//                     return true
//                 }
//             }
//         })
//         // if(flag){
//         //     flag = false
//         //     return true
//         // }
//         // })
//     }
// }
//
//
// export const addtoMainDownloadingQueue = (downloadObj) => {
//     return (dispatch, getState) => {
//         debugger
//
//         let downloadArray = _.cloneDeep(getState().userLoginForm.mainDownloadQueue)
//         debugger
//
//         if(!(_.includes(downloadArray,downloadObj))){
//             downloadArray.push(downloadObj)
//             dispatch({
//                 type:SET_DOWNLOAD_QUEUE,
//                 payload: downloadArray
//             })
//
//             if(downloadObj.type==="sites"){
//                 let packs = _.cloneDeep(getState().userLoginForm.allPacks)
//                 let index = _.findIndex(packs,{language:downloadObj.objLanguage})
//                 packs[index]["sites"][downloadObj.siteIndex]["isDownload"] = 3
//                 debugger
//                 dispatch(setPackData(packs))
//
//                 setTimeout(() => {
//                     dispatch(startDownloadingQueue(true))
//                 },200)
//             }
//         }
//
//         debugger
//
//
//     }
// }
//

export const startDownloadingQueue = () => {
    debugger
    return (dispatch, getState) => {
        let downloadArray = getState().userLoginForm.mainDownloadQueue
        let dirs = '';
        if (Constant.IOS) {
            dirs = RNFetchBlob.fs.dirs.DocumentDir
        } else {
            dirs = RNFetchBlob.fs.dirs.SDCardApplicationDir
        }

        if(downloadArray.length > 0){

            RNFS.getFSInfo(dirs)
                .then ((info) => {
                    // console.log("Free Space is" + info.freeSpace + "Bytes")
                    // console.log("Free Space is" + info.freeSpace / 1024 + "KB")

                    if((info.freeSpace / 1024 / 1024) > 10){

                        setTimeout(() => {
                            dispatch(downloadSitesData(downloadArray[0]))
                        },0)
                    }

                    else{
                        Alert.alert("Your device doesn't have enough memory space to download this file")
                    }
                })
        }
    }
}

export const getPacks = (isFirst) => {

    return (dispatch, getState) => {
        debugger
        return axios.get(API_CONSTANTS.baseUrl+API_CONSTANTS.getPacks+getState().userLoginForm.user._id,{headers:{"authorization":getState().userLoginForm.token}})
            .then((response) => {
                let dirs = '';
                if (Constant.IOS) {
                    dirs = RNFS.DocumentDirectoryPath
                } else {
                    dirs = RNFS.ExternalDirectoryPath
                }
                let downloadArrayIntro = getState().userLoginForm.introductionAudioArray
                let downloadsitesAudioObject = getState().userLoginForm.sitesAudioObject
                let oldUserPacks = getState().userLoginForm.currentPacks
                let newPacksObject = response.data;

                let tempdownloadsitesAudioObject = {}
debugger
                newPacksObject.map((obj,objIndex) => {
                    if(obj.languageId){
                        let key = 'introAudio'
                        let index = _.findIndex(downloadArrayIntro,{language: obj.language})
                        if(index === -1){

                            let downloadObj = {
                                introAudioURL: newPacksObject[objIndex]["languageId"][key],
                                language: obj.language,
                                jobID: 0,
                                isDownloadPercentage: 0,
                                localFilePath: '',
                                audioURLSize: 0
                            }
                            downloadArrayIntro.push(downloadObj)
                        }

                        // thingstoDownload.map((key) => {

                        // let downloadIntroResponse =  setIntroDownloadOption(oldPackObject,newPacksObject[objIndex]._id,key)
                        //
                        // newPacksObject[objIndex]["languageId"]["old"+key] = newPacksObject[objIndex]["languageId"][key]
                        // newPacksObject[objIndex]["languageId"]["isDownload"+key] = downloadIntroResponse
                        //
                        // if(downloadIntroResponse === 2){
                        //     newPacksObject[objIndex]["languageId"][key] = oldPackObject[objIndex]["languageId"][key]
                        // }else if(downloadIntroResponse === 1){
                        //     newPacksObject[objIndex]["languageId"]["isDownloadingPercentage"] = oldPackObject[objIndex]["languageId"]["isDownloadingPercentage"]
                        // }else if(downloadIntroResponse === 0){

                        // RNFS.getFSInfo(dirs)
                        //     .then ((info) => {
                        //         // console.log("Free Space is" + info.freeSpace + "Bytes")
                        //         // console.log("Free Space is" + info.freeSpace / 1024 + "KB")
                        //
                        //         if ((info.freeSpace / 1024 / 1024) > 10) {
                        //
                        //             dispatch(downloadIntroData({
                        //                 type: "intro",
                        //                 key: key,
                        //                 object: obj,
                        //                 newPacks: newPacksObject,
                        //                 objIndex: objIndex,
                        //                 objID: obj._id
                        //             }))
                        //         } else {
                        //             debugger
                        //             Alert.alert("Your device doesn't have enough memory space to download this file")
                        //         }
                        //     })
                        // }
                        // });

                        let sitesData = []
                        obj.sites.map((data,index) => {

                            sitesData.push({
                                siteAudioURL:(data.audioURL !== '')?data.audioURL:'',
                                siteName: data.siteId.name,
                                language: obj.language,
                                jobID: 0,
                                isDownloadPercentage: 0,
                                localFilePath: '',
                                audioURLSize: data.audioURLSize || 0
                            })
                            // //if(obj.languageId._id === selectedLanguage._id) {
                            //
                            // // let siteImagesToDownload = ["siteImage", "coverImageURL", "footstepImageURL"]
                            // //
                            // // siteImagesToDownload.map((key) => {
                            // //
                            // //
                            // //     let downloadSiteResponse = setDownloadOptionSiteImages(oldPackObject, newPacksObject[objIndex]._id, newPacksObject[objIndex]["sites"][index]._id, key)
                            // //     newPacksObject[objIndex]["sites"][index]["old" + key] = newPacksObject[objIndex]["sites"][index][key]
                            // //
                            // //     if (downloadSiteResponse === 2) {
                            // //         newPacksObject[objIndex]["sites"][index][key] = oldPackObject[objIndex]["sites"][index][key]
                            // //     } else if(downloadSiteResponse === 0){
                            // //         dispatch(downloadSitesDataImages({
                            // //             type: "sites",
                            // //             key: key,
                            // //             data: data,
                            // //             objLanguage: obj.language,
                            // //             newPacks: newPacksObject,
                            // //             objIndex: objIndex,
                            // //             siteIndex: index
                            // //         }))
                            // //     }
                            // //     newPacksObject[objIndex]["sites"][index]["isDownload" + key] = downloadSiteResponse
                            // // })
                            // // }
                            //
                            // let codeId = setDownloadOption(oldPackObject,newPacksObject[objIndex]._id,newPacksObject[objIndex]["sites"][index]._id,newPacksObject[objIndex]["sites"][index]["audioURL"])
                            //
                            // newPacksObject[objIndex]["sites"][index]["oldAudioURL"] = newPacksObject[objIndex]["sites"][index]["audioURL"]
                            //
                            //
                            //
                            // if(codeId === 2){
                            //     newPacksObject[objIndex]["sites"][index]["audioURL"] = oldPackObject[objIndex]["sites"][index]["audioURL"]
                            // }else if(codeId === 1){
                            //     newPacksObject[objIndex]["sites"][index]["isDownloadingPercentage"] = oldPackObject[objIndex]["sites"][index]["isDownloadingPercentage"]
                            // }
                            //
                            // newPacksObject[objIndex]["sites"][index]["isDownload"] = codeId
                            // if(isFirst) {
                            //     if (data.audioURL) {
                            //         if (newPacksObject[objIndex]["sites"][index]["isDownload"] === 0) {
                            //             let targetFilePath = [dirs, 'ITBF', 'Packs', obj.language, data._id, "audioURL.mp3"].join('/');
                            //             RNFetchBlob.fs.exists(targetFilePath)
                            //                 .then((exist) => {
                            //                     if (exist === true) {
                            //                         newPacksObject[objIndex]["sites"][index]["isDownload"] = 2;
                            //                         newPacksObject[objIndex]["sites"][index]["audioURL"] = "file://" + targetFilePath
                            //                         dispatch(setPackData(newPacksObject))
                            //                     }
                            //                     // console.log(`file ${exist ? '' : 'not'} exists`)
                            //                 })
                            //                 .catch((err) => {
                            //                     console.log("error checking file existance",err)
                            //                     debugger
                            //                 })
                            //             // dispatch(downloadSitesData(data.audioURL,obj.language,data._id,index,'audioURL',objIndex,newPacksObject))
                            //         }
                            //     }
                            // }
                        })
                            tempdownloadsitesAudioObject[obj.language] = sitesData

                    }
                })

                if(Object.keys(getState().userLoginForm.sitesAudioObject).length === 0) {
                    downloadsitesAudioObject = tempdownloadsitesAudioObject
                }else{
                    if(isFirst){
                        let userPacks = [];
                        getState().userLoginForm.user.packs.map((pack) => {
                            if(pack.packId){
                                userPacks.push(pack.packId.language)
                            }
                        })

                        Object.keys(downloadsitesAudioObject).map((key) => {
                            if(!(_.includes(userPacks,key))){
                                downloadsitesAudioObject[key].map((site,siteIndex) => {
                                    downloadsitesAudioObject[key][siteIndex].siteAudioURL = ''
                                })
                            }else{
                                downloadsitesAudioObject[key].map((site,siteIndex) => {
                                    let index = _.findIndex(tempdownloadsitesAudioObject[key],{siteName: site.siteName})
                                    if(index > 0){
                                        downloadsitesAudioObject[key][siteIndex].siteAudioURL = tempdownloadsitesAudioObject[key][index].siteAudioURL
                                    }else{
                                        downloadsitesAudioObject[key][siteIndex].siteAudioURL = tempdownloadsitesAudioObject[key][siteIndex].siteAudioURL
                                    }
                                })
                            }
                        })
                    }
                }
                debugger

                return Promise.all([

                    dispatch({
                        type: SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
                        payload: downloadArrayIntro
                    }),
                    dispatch({
                        type: SET_SITES_AUDIO_DOWNLOAD_DATA,
                        payload: downloadsitesAudioObject
                    }),
                    dispatch(setPackData(newPacksObject)),

                    dispatch({
                        type: CLEAR_DATA,
                        payload: false
                    }),

                ]).then(res => {
                    if(isFirst){

                        dispatch(downloadIntroductionAudio())
                        dispatch(resumeDownloads())

                    }
                    return Promise.resolve();
                }).catch((err) => {
                    debugger
                    console.log("error resolving getPacks",err)
                    return Promise.reject()
                });


                // dispatch(setDownloadingQueue())


            })
            .catch((e) => {
                console.log('catch error getPack API', e);
                debugger
                if(e.response.status === 301){
                    return Promise.reject('user not found')
                }
                if (e.response.data.error){
                    return Promise.reject(e.response.data.error);
                }else {
                    return Promise.reject(Constant.ServerError)
                }
                throw new Error(e);
            });
    };
};
/*data={
audioURL: ,
allPacksObj: ,
}*/
checkArray = (array) => {
    if(array.length > 0){
        let isSame = !!array.reduce(function(a, b){ return (a.jobID === b.jobID) ? a : NaN; })
        if(isSame && array[0].jobID === 'completed'){
            return true
        }
    }
    return false
}
export const downloadIntroductionAudio = () => {
    return (dispatch, getState) => {
        let introDownloadArray = _.cloneDeep(getState().userLoginForm.introductionAudioArray)
        debugger
        let id = checkArray(introDownloadArray)
        debugger
        if(!id){
            let tempArray = []
            introDownloadArray.map((introObj) => {
                if(introObj.jobID !== 'completed'){
                    console.log("push to array",introObj.language)
                    tempArray.push(introObj)
                }
            })
            tempArray.map((tempObj) => {
                dispatch(downloadSingleIntroductionAudio(tempObj))
            })
        }

    }
}
export const downloadSingleIntroductionAudio = (downloadData) => {
    return (dispatch, getState) => {
        debugger
        if(downloadData.introAudioURL && downloadData.introAudioURL !== ''){
            let dirs = '';
            if (Constant.IOS) {
                dirs = RNFS.DocumentDirectoryPath
            } else {
                dirs = RNFS.ExternalDirectoryPath
            }
            debugger
            RNFS.mkdir(dirs+'/ITBF/Introduction'+'/'+downloadData.language).then((res) => {
                debugger
                let background = true;
                const progress = data => {
                    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
                    const text = `Progress ${percentage}%`;
                    let introDownloadArray = _.cloneDeep(getState().userLoginForm.introductionAudioArray)
                    if(introDownloadArray.length > 0) {

                        let index = _.findIndex(introDownloadArray, {language: downloadData.language})

                        introDownloadArray[index].isDownloadPercentage = percentage
                        dispatch({
                            type: SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
                            payload: introDownloadArray
                        })
                    }
                    console.log("Language",downloadData.language,"****",percentage)
                };

                const begin = res => {
                    // this.setState({ output: 'Download has begun' });
                };

                const progressDivider = 20;


                const downloadDest = `${dirs}/ITBF/Introduction/${downloadData.language}/introAudio.mp3`;
                const ret = RNFS.downloadFile({ fromUrl: API_CONSTANTS.baseUrl+downloadData.introAudioURL, toFile: downloadDest, begin, progress, background, progressDivider });
                jobId = ret.jobId;

                let introDownloadArray = _.cloneDeep(getState().userLoginForm.introductionAudioArray)
                if(introDownloadArray.length > 0) {

                    let index = _.findIndex(introDownloadArray, {language: downloadData.language})
                    introDownloadArray[index].jobID = jobId
                    dispatch({
                        type: SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
                        payload: introDownloadArray
                    })
                }
                ret.promise.then(res => {

                    jobId = 1;
                    let introDownloadArray = _.cloneDeep(getState().userLoginForm.introductionAudioArray)
                    if(introDownloadArray.length > 0) {

                        let index = _.findIndex(introDownloadArray, {language: downloadData.language})

                        introDownloadArray[index].isDownloadPercentage = 100
                        introDownloadArray[index].localFilePath = 'file://' + downloadDest
                        introDownloadArray[index].jobID = 'completed'
                        dispatch({
                            type: SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
                            payload: introDownloadArray
                        })
                    }
                    console.log('download then:::',introDownloadArray)

                }).catch(err => {
                    console.log(err)
                    jobId = 0;
                    let introDownloadArray = _.cloneDeep(getState().userLoginForm.introductionAudioArray)

                    if(introDownloadArray.length > 0){
                        let index = _.findIndex(introDownloadArray,{language: downloadData.language})

                        introDownloadArray[index].isDownloadPercentage = 0;
                        introDownloadArray[index].localFilePath = '';
                        introDownloadArray[index].jobID = 0;
                        dispatch({
                            type: SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
                            payload: introDownloadArray
                        })
                    }

                });

            }).catch((err) => {
                debugger
                console.log("error creting path for introduction audio")
            })
        }else{
            console.log("Introduction Audio URL is NULL")
        }
    }
}

export const downloadSiteAudio = (language) => {
    return (dispatch, getState) => {
        console.log("in download Introduction array")
        let sitesDownloadArray = _.cloneDeep(getState().userLoginForm.sitesAudioObject[language])
        if(sitesDownloadArray){
            let id = checkArray(sitesDownloadArray)
            debugger
            if(!id){
                let tempArray = []
                sitesDownloadArray.map((siteObj) => {
                    if(siteObj.jobID !== 'completed'){
                        console.log("push to array",siteObj.language, siteObj.siteName)
                        tempArray.push(siteObj)
                    }
                })
                tempArray.map((tempObj) => {
                    dispatch(downloadSingleSiteAudio(tempObj))
                })
            }
        }
    }

}

export const downloadSingleSiteAudio = (downloadData) => {
    return (dispatch, getState) => {
        debugger

        if(downloadData.siteAudioURL && downloadData.siteAudioURL !== ''){
            let dirs = '';
            if (Constant.IOS) {
                dirs = RNFS.DocumentDirectoryPath
            } else {
                dirs = RNFS.ExternalDirectoryPath
            }
            debugger
            RNFS.mkdir(dirs+'/ITBF/Packs'+'/'+downloadData.language+'/'+downloadData.siteName).then((res) => {
                debugger
                let background = true;
                const progress = data => {
                    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
                    const text = `Progress ${percentage}%`;

                    console.log("percentageeee",percentage,downloadData.siteName)
                    let siteDownloadObj = _.cloneDeep(getState().userLoginForm.sitesAudioObject)

                    if(Object.keys(siteDownloadObj).length > 0){
                        let index = _.findIndex(siteDownloadObj[downloadData.language],{siteName: downloadData.siteName})

                        siteDownloadObj[downloadData.language][index].isDownloadPercentage = (siteDownloadObj[downloadData.language][index].isDownloadPercentage > percentage)?
                            siteDownloadObj[downloadData.language][index].isDownloadPercentage:percentage

                        dispatch({
                            type: SET_SITES_AUDIO_DOWNLOAD_DATA,
                            payload: siteDownloadObj
                        })
                    }
                };

                const begin = res => {
                    // this.setState({ output: 'Download has begun' });
                };

                const progressDivider = 20;


                const downloadDest = `${dirs}/ITBF/Packs/${downloadData.language}/${downloadData.siteName}/siteAudio.mp3`;
                const ret = RNFS.downloadFile({ fromUrl: API_CONSTANTS.baseUrl+downloadData.siteAudioURL, toFile: downloadDest, begin, progress, background, progressDivider });
                jobId = ret.jobId;

                let siteDownloadObj = _.cloneDeep(getState().userLoginForm.sitesAudioObject)
                if(Object.keys(siteDownloadObj).length > 0) {

                    let index = _.findIndex(siteDownloadObj[downloadData.language], {siteName: downloadData.siteName})

                    siteDownloadObj[downloadData.language][index].jobID = jobId
                    dispatch({
                        type: SET_SITES_AUDIO_DOWNLOAD_DATA,
                        payload: siteDownloadObj
                    })
                }

                ret.promise.then(res => {

                    jobId = 1;
                    let siteDownloadObj = _.cloneDeep(getState().userLoginForm.sitesAudioObject)
                    if(Object.keys(siteDownloadObj).length > 0) {

                        let index = _.findIndex(siteDownloadObj[downloadData.language], {siteName: downloadData.siteName})

                        siteDownloadObj[downloadData.language][index].isDownloadPercentage = 100
                        siteDownloadObj[downloadData.language][index].localFilePath = 'file://' + downloadDest
                        siteDownloadObj[downloadData.language][index].jobID = 'completed'
                        dispatch({
                            type: SET_SITES_AUDIO_DOWNLOAD_DATA,
                            payload: siteDownloadObj
                        })
                    }
                    console.log('download then:::',siteDownloadObj)

                }).catch(err => {
                    console.log(err)
                    jobId = 0;
                    let siteDownloadObj = _.cloneDeep(getState().userLoginForm.sitesAudioObject)
                    if(Object.keys(siteDownloadObj).length > 0) {

                        let index = _.findIndex(siteDownloadObj[downloadData.language], {siteName: downloadData.siteName})

                        siteDownloadObj[downloadData.language][index].isDownloadPercentage = 0
                        siteDownloadObj[downloadData.language][index].localFilePath = ''
                        siteDownloadObj[downloadData.language][index].jobID = 0
                        dispatch({
                            type: SET_SITES_AUDIO_DOWNLOAD_DATA,
                            payload: siteDownloadObj
                        })
                    }
                });

            }).catch((err) => {
                debugger
                console.log("error creting path for introduction audio")
            })
        }else{
            console.log("Introduction Audio URL is NULL")
        }
    }
}

export const resumeDownloads = () => {
    return (dispatch, getState) => {
        debugger
        console.log("resume downloadssssssss")
        let siteDownloadObj = _.cloneDeep(getState().userLoginForm.sitesAudioObject)
        if(siteDownloadObj) {
            Object.keys(siteDownloadObj).map(key => {
                siteDownloadObj[key].map((siteObj) => {
                    if(siteObj.siteAudioURL !== ''){
                        if (siteObj.jobID === 0 || siteObj.jobID === 'completed') {

                        } else {
                            dispatch(downloadSingleSiteAudio(siteObj))
                        }
                    }

                })
            })
        }
    }

}
export const setIntroData = (value) => {
    return (dispatch, getState) => {

        let lang = getState().selectedLang.selected_lang
        let langIndex = _.findIndex(getState().userLoginForm.allPacks, {language: lang.language})


        if(langIndex < 0){
            langIndex = 0
        }
        dispatch({
            type: SET_INTRODUCTION_DATA,
            payload: _.cloneDeep(getState().userLoginForm.allPacks[langIndex])
        });
    }
}

export const getCurrentSites = () => {
    return (dispatch, getState) => {

        let lang = getState().selectedLang.selected_lang
        let langIndex = _.findIndex(getState().userLoginForm.allPacks, {language: lang.language})


        if(langIndex < 0){
            langIndex = 0
        }

        dispatch({
            type: SET_CURRENT_SITE_DATA,
            payload: _.cloneDeep(getState().userLoginForm.allPacks[langIndex].sites)
        });
    }
}
export const getCurrentPacks = (allData) => {
    return (dispatch, getState) => {
        let userPacks = [];
        getState().userLoginForm.user.packs.map((pack,packIndex) => {

            if(pack.packId){
                let a = _.find(allData, {_id: pack.packId._id})
                if(a){
                    userPacks.push(a)
                }

            }
        })
        debugger
        dispatch({
            type: SET_CURRENT_PACK_DATA,
            payload: userPacks
        });
    }
}
export const addPack = (packid) => {
    return (dispatch, getState) => {

        return axios.post(API_CONSTANTS.baseUrl+API_CONSTANTS.addPack,{userId:getState().userLoginForm.user._id,packId:packid},{headers:{"authorization":getState().userLoginForm.token}})
            .then((response) => {
                debugger
               return Promise.all([
                   dispatch({
                       type: APP_SET_USER_DATA,
                       payload: {user: response.data, token: getState().userLoginForm.token },
                   }),

                dispatch(getPacks(true)),
                dispatch(getStorePacks(response.data.packs))
               ]).then((res) => {
                   return Promise.resolve()
               }).catch((err) => {
                    return Promise.reject()
               })
            })
            .catch((e) => {
                debugger
                if (e.response && e.response.data){
                    return Promise.reject(e.response.data.error)
                }else {
                    return Promise.reject("Network Error")
                }
            });
    }
}
export const setPackData = (packs,isIntroduction = false) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_PACK_DATA,
            payload: packs
        })
        dispatch(getCurrentPacks(packs));
        dispatch(getCurrentSites());
        if(isIntroduction){
            dispatch(setIntroData())
        }
    }
}
export const clearPackData = (objLanguage) => {
    return (dispatch, getState) => {

        let sitesAudioObject = _.cloneDeep(getState().userLoginForm.sitesAudioObject);

        //stop currently playing audio if selected language pack is deleted

        if(objLanguage === (getState().selectedLang.selected_lang.language)){
            debugger
            console.log("currently playing:",getState().player.player.playerText)
            if(getState().player.player.playerText !== strings.introduction){

                dispatch(setCurrentAudio({
                    playerURL: '',
                    playerImage: '',
                    playerText: '',
                    currentTime: 0,
                    duration: 0,
                    seekTotime: 0,
                    playingAudio: false,
                    isFirst: false,
                    currentlyPlayingAudio: '',
                }))
                dispatch(showPlayerComponent(false))
                TrackPlayer.reset()
            }

        }

        let dirs = '';
        sitesAudioObject[objLanguage].map((site,index) => {

            if(site.jobID !== 0){
                //stop downloadingg
                if(site.jobID !== 'completed'){
                    RNFS.stopDownload(site.jobID)
                }
            }
            if (Constant.IOS){

                dirs = RNFS.DocumentDirectoryPath+'/ITBF/Packs/'+objLanguage+'/'+site.siteName+'/'+'siteAudio.mp3'
            }else{
                dirs = RNFS.ExternalDirectoryPath+'/ITBF/Packs/'+objLanguage+'/'+site.siteName+'/'+'siteAudio.mp3'
            }


            return RNFS.unlink(dirs)
                .then((res) => {

                    let siteDownloadObj = _.cloneDeep(getState().userLoginForm.sitesAudioObject)

                    siteDownloadObj[objLanguage][index].isDownloadPercentage = 0
                    siteDownloadObj[objLanguage][index].localFilePath = ''
                    siteDownloadObj[objLanguage][index].jobID = 0
                    dispatch({
                        type: SET_SITES_AUDIO_DOWNLOAD_DATA,
                        payload: siteDownloadObj
                    })


                    // allPackData[packIndex].sites[index].isDownload = 0;
                    // allPackData[packIndex].sites[index].isDownloadingPercentage = 0;
                    // allPackData[packIndex].sites[index].audioURL = allPackData[packIndex].sites[index].oldAudioURL
                    //
                    // allPackData.splice(packIndex, 1, allPackData[packIndex]);
                    //
                    //
                    //
                    // dispatch(setPackData(allPackData))

                    return Promise.resolve()
                })
                .catch((err) => {

                    return Promise.reject(err)
                })
        });

    }
}
export const logoutUser = () => {
    return (dispatch, getState) => {
        dispatch(stopAllonGoingDownloads())
        dispatch(userLoginUpdate({prop: 'email', value: ''}))
        dispatch(userLoginUpdate({prop: 'password', value: ''}))
        dispatch(userLoginUpdate({prop: 'passwordcng', value: ''}))
        dispatch(userLoginUpdate({prop: 'repasswordcng', value: ''}))
        dispatch(userRegisterUpdate({prop: 'email', value: ''}))
        dispatch(userRegisterUpdate({prop: 'password', value: ''}))
        dispatch(userRegisterUpdate({prop: 'repassword', value: ''}))
        dispatch(userRegisterUpdate({prop: 'coupon', value: ''}))
        dispatch(setCurrentAudio({
            playerURL: '',
            playerImage: '',
            playerText: '',
            currentTime: 0,
            duration: 0,
            seekTotime: 0,
            playingAudio: false,
            isFirst: false,
            currentlyPlayingAudio: '',
        }))
        dispatch(showPlayerComponent(false))
        TrackPlayer.reset()
    }
}
export const stopAllonGoingDownloads = () => {
    return (dispatch, getState) => {

        let introDownloadArray = _.cloneDeep(getState().userLoginForm.introductionAudioArray)
        introDownloadArray.map((introObj) => {
            if(introObj.jobID !== 0) {
                if (introObj.jobID !== 'completed') {
                    RNFS.stopDownload(introObj.jobID)
                }
            }
        })

        let sitesAudioObject = _.cloneDeep(getState().userLoginForm.sitesAudioObject);

        Object.keys(sitesAudioObject).map((key) => {
            sitesAudioObject[key].map((site,index) => {

                if (site.jobID !== 0) {
                    //stop downloadingg
                    if (site.jobID !== 'completed') {
                        RNFS.stopDownload(site.jobID)
                    }
                }
            })
        })

        return Promise.resolve("stopped all downloads")

    }
}
export const clearStoreData = () => {
    return (dispatch, getState) => {


        let dirs = '';
        if (Constant.IOS){
            dirs = RNFS.DocumentDirectoryPath+'/ITBF/'
        }else{
            dirs = RNFS.ExternalDirectoryPath+'/ITBF/'
        }

        return RNFS.unlink(dirs)
            .then((res) => {

                dispatch(stopAllonGoingDownloads()).then(() => {

                    dispatch({
                        type: CLEAR_DATA,
                        payload: true
                    });

                    dispatch({
                        type:SET_PACK_DATA,
                        payload: []
                    })
                    dispatch({
                        type:SET_CURRENT_PACK_DATA,
                        payload: []
                    })
                    dispatch({
                        type:SET_CURRENT_SITE_DATA,
                        payload: []
                    })
                    dispatch({
                        type:SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
                        payload: []
                    })
                    dispatch({
                        type:SET_SITES_AUDIO_DOWNLOAD_DATA,
                        payload: {}
                    })

                    dispatch(setCurrentAudio({
                        playerURL: '',
                        playerImage: '',
                        playerText: '',
                        currentTime: 0,
                        duration: 0,
                        seekTotime: 0,
                        playingAudio: false,
                        isFirst: false,
                        currentlyPlayingAudio: '',
                    }))
                    dispatch(showPlayerComponent(false))
                    TrackPlayer.reset()
                    return Promise.resolve()
                })
            })

            .catch((err) => {

                return Promise.reject(err)
            })

    }
}

getUserCountry = () => {
    return axios.get('https://freegeoip.net/json/').then((response) => {
        return Promise.resolve(response.data)
    }).catch(() => {
        return Promise.resolve('')
    })
};
