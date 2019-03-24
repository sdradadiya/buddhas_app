import { USER_REGISTER_UPDATE, USER_CREATE,APP_SET_USER_DATA,LOGIN_SUCCESS } from './types';
import {AsyncStorage,Platform} from 'react-native';
import axios from 'axios';
import API_CONSTANTS from '../helper/apiConstants'
import Constant from '../helper/constants'


export const userRegisterUpdate = ({ prop, value }) => {
    return {
        type: USER_REGISTER_UPDATE,
        payload: { prop, value }
    }
};
getUserCountry = () => {
    return axios.get('https://freegeoip.net/json/').then((response) => {
        return Promise.resolve(response.data)
    }).catch(() => {
        return Promise.resolve('')
    })
};
export const userCreates = (email, password, repassword, coupon) => {
    return (dispatch, getState) => {

     return getUserCountry().then((res) => {
         debugger
        let selectLang = getState().selectedLang.selected_lang.language;
         let body = {
             email: email,
             password: password,
             location:  res,
             platform: (Constant.IOS) ? 'IOS' : 'Android',
             selectedLanguage: selectLang.toString()
         };

         debugger
        return axios.post(API_CONSTANTS.baseUrl + API_CONSTANTS.register, body)
            .then((response) => {
debugger
                AsyncStorage.setItem('user', JSON.stringify({email: email , password:password}));
                dispatch({
                    type: APP_SET_USER_DATA,
                    payload: response.data,
                });
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: "successful"
                });
                return Promise.resolve('Login SuccessFull')
            })
            .catch((e) => {
                debugger

                if (e.response){
                    AsyncStorage.clear();
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: "unsuccessful"
                    });
                    return Promise.reject(e.response.data.error)
                }else {
                    return Promise.reject("Network Error")
                }
            });
       })

    };
};


export const fetchLatestUpdates = () => (dispatch) => {
    return axios.get('')
        .then((response) => {
            dispatch(showLoadingIndicator(false));
            return dispatch({
                type: 'UPDATES_LATEST_DATA',
                payload: response.data,
            });
        })
        .catch((e) => {
            dispatch(showLoadingIndicator(false));
            console.log('catch error', e);
            return Promise.reject()
        });
};