import {
    APP_SET_USER_DATA,
    USER_LOGIN_UPDATE,
    LOGIN_SUCCESS,
    PASSWORD_CHANGE,
    PASSWORD_CHANGE_UPDATE,
    SET_PACK_DATA,
    SET_CURRENT_PACK_DATA,
    SET_INTRODUCTION_DATA,
    SET_CURRENT_SITE_DATA,
    CLEAR_DATA,
    SET_STORE_DATA,
    SET_LANGUAGE_DATA,
    SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA,
    SET_SITES_AUDIO_DOWNLOAD_DATA,

} from '../actions/types'

const INITIAL_STATE = {
    email: process.env.NODE_ENV === 'development' ? 'user@example.com' : '',
    password: process.env.NODE_ENV === 'development' ? 'user' : '',
    passwordcng:'',
    repasswordcng:'',
    allPacks:[],
    currentPacks:[],
    currentSites:[],
    storePacks:[],
    allLanguages: [],
    clearStore: false,
    introductionAudioArray:[],
    sitesAudioObject: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case APP_SET_USER_DATA: {
debugger
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
            }
        }

        case USER_LOGIN_UPDATE :
            return {
                ...state,
                [action.payload.prop] : action.payload.value
            };

        case SET_INTRODUCTION_DATA :
            return {
                ...state,
                introduction : action.payload
            };
        case SET_LANGUAGE_DATA :
            return {
                ...state,
                allLanguages : action.payload
            };


        case LOGIN_SUCCESS: {
            return{
                ...state,
                loginSuccess: action.payload,
            }
        }

        case PASSWORD_CHANGE_UPDATE :
            return { ...state, [action.payload.prop] : action.payload.value };


        case PASSWORD_CHANGE :
            return { ...state, passwordSuccess: action.payload, };

        case SET_PACK_DATA :

            return {
                ...state,
                allPacks: action.payload
            };

        case SET_STORE_DATA :

            return {
                ...state,
                storePacks: action.payload
            };

        case SET_CURRENT_PACK_DATA :

            return {
                ...state,
                currentPacks: action.payload
            };

        case SET_CURRENT_SITE_DATA :

            return {
                ...state,
                currentSites: action.payload
            };


        case SET_INTRODUCTION_AUDIO_DOWNLOAD_DATA :

            return {
                ...state,
                introductionAudioArray: action.payload
            };

        case SET_SITES_AUDIO_DOWNLOAD_DATA :

            return {
                ...state,
                sitesAudioObject: action.payload
            };


        case CLEAR_DATA :
            return {
                ...state,
                clearStore: action.payload
            };

        default :
            return state;
    }
}
