import { SELECT_LANGUAGE } from './types';
import {AsyncStorage} from 'react-native';
import strings from '../helper/language';
import {getLanguageString} from '../helper/commonFunctions';
import {getCurrentSites,setIntroData} from './loginAction'

export const userSelectLang = (selected_lang,props) => {
    return (dispatch) => {
        debugger
        dispatch({
            type: SELECT_LANGUAGE,
            payload: selected_lang
        });


        AsyncStorage.setItem('selected_lang', getLanguageString(selected_lang.language));
        strings.setLanguage(getLanguageString(selected_lang.language));

        console.log("Language actionsss props::",props)
        if(props !== null && props.route){
            console.log("in props.route")
            if(props.route.params.isFromSettingScreen){
                console.log("in props.route having fromsettingScreen")

                dispatch(getCurrentSites())
                dispatch(setIntroData())
            }
            console.log("setting props,sending response:::",props.route.params.isFromSettingScreen)
            return Promise.resolve(props.route.params.isFromSettingScreen)
        }
        console.log("return false forcefully......")
        return Promise.resolve(false)

    };
};