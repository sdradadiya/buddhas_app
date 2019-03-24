import {Alert} from 'react-native';
import API_CONSTANT from './apiConstants';

export function showAlert(alertText) {
    let modifiedText = alertText;
    if(typeof alertText !== 'string'){
        modifiedText = "Something went wrong"
    }
    Alert.alert("",
        modifiedText,
        [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
    )
}
export function getUrl(url){

    if (url.substring(0, 8) === "uploads/") {
        url = API_CONSTANT.baseUrl + url
    }

    return url
}


export function getLanguageString(lan){
    switch (lan){
        case "Spanish":
            return "en";
        case "French":
            return "it";
        case "Russian":
            return "rs";
        case "Chinese":
            return "ch";
        default:
            return "en-US"
    }
}
// English    0    Lumbini    0    Cover Image    0
// French    1    Bodhgaya    1    Footstep Image    1
// Spanish    2    Sarnath    2    Site image    2
// Russian    3    Kushinagara    3
// Chinese    4    Sravasthi    4
// Vaishali    5
// Rajagir    6
// Sankasya    7
//
//
// Language    3
// Site    4
// Image    2
// Index    86            (24*LanguageVal)+(3*SiteValue)+ImageValue
//


export const getIndex = (language, site, image) => {
    let languageId =
        (language === "English") ? 0 :
            (language === "French") ? 1 :
                (language === "Spanish") ? 2 :
                    (language === "Russian") ? 3 :
                        (language === "Chinese") ? 4 : 0;
    let siteId =
        (site === "Lumbini") ? 0 :
            (site === "Bodhgaya") ? 1 :
                (site === "Sarnath") ? 2 :
                    (site === "Kushinagara") ? 3 :
                        (site === "Sravasti") ? 4 :
                            (site === "Vaishali") ? 5 :
                                (site === "Rajagir") ? 6 :
                                    (site === "Sankasya") ? 7 : 0;
    let imageId =
        (image === "coverImageURL") ? 0 :
            (image === "footstepImageURL") ? 1 :
                (image === "siteImageURL") ? 2 : 0;
    debugger
    return (24*languageId)+(3*siteId)+imageId
}

export const mainFiles=
    [
        require("../../images/uploads/1/sites/1-1/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-1/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-1/siteImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-2/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-2/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-2/siteImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-3/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-3/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-3/siteImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-4/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-4/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-4/siteImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-5/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-5/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-5/siteImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-6/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-6/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-6/siteImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-7/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-7/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-7/siteImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-8/coverImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-8/footstepImageURL.jpeg"),
        require("../../images/uploads/1/sites/1-8/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-1/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-1/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-1/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-2/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-2/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-2/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-3/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-3/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-3/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-4/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-4/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-4/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-5/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-5/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-5/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-6/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-6/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-6/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-7/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-7/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-7/siteImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-8/coverImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-8/footstepImageURL.jpeg"),
        require("../../images/uploads/2/sites/2-8/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-1/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-1/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-1/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-2/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-2/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-2/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-3/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-3/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-3/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-4/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-4/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-4/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-5/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-5/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-5/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-6/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-6/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-6/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-7/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-7/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-7/siteImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-8/coverImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-8/footstepImageURL.jpeg"),
        require("../../images/uploads/3/sites/3-8/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-1/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-1/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-1/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-2/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-2/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-2/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-3/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-3/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-3/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-4/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-4/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-4/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-5/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-5/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-5/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-6/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-6/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-6/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-7/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-7/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-7/siteImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-8/coverImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-8/footstepImageURL.jpeg"),
        require("../../images/uploads/4/sites/4-8/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-1/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-1/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-1/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-2/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-2/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-2/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-3/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-3/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-3/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-4/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-4/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-4/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-5/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-5/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-5/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-6/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-6/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-6/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-7/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-7/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-7/siteImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-8/coverImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-8/footstepImageURL.jpeg"),
        require("../../images/uploads/5/sites/5-8/siteImageURL.jpeg")]
export const introFiles=
    {
        "English": {
            "introImage":require('../../images/uploads/1/introImage.jpeg'),
            "allSiteImage":require('../../images/uploads/1/allSiteImage.jpeg'),
            "footstepImage":require('../../images/uploads/1/footstepImage.jpeg'),
            "authorImage":require('../../images/uploads/1/authorImage.jpeg'),
        },
        "French": {
            "introImage":require('../../images/uploads/2/introImage.jpeg'),
            "allSiteImage":require('../../images/uploads/2/allSiteImage.jpeg'),
            "footstepImage":require('../../images/uploads/2/footstepImage.jpeg'),
            "authorImage":require('../../images/uploads/2/authorImage.jpeg'),
        },
        "Spanish": {
            "introImage":require('../../images/uploads/3/introImage.jpeg'),
            "allSiteImage":require('../../images/uploads/3/allSiteImage.jpeg'),
            "footstepImage":require('../../images/uploads/3/footstepImage.jpeg'),
            "authorImage":require('../../images/uploads/3/authorImage.jpeg'),
        },
        "Russian": {
            "introImage":require('../../images/uploads/4/introImage.jpeg'),
            "allSiteImage":require('../../images/uploads/4/allSiteImage.jpeg'),
            "footstepImage":require('../../images/uploads/4/footstepImage.jpeg'),
            "authorImage":require('../../images/uploads/4/authorImage.jpeg'),
        },
        "Chinese": {
            "introImage":require('../../images/uploads/5/introImage.jpeg'),
            "allSiteImage":require('../../images/uploads/5/allSiteImage.jpeg'),
            "footstepImage":require('../../images/uploads/5/footstepImage.jpeg'),
            "authorImage":require('../../images/uploads/5/authorImage.jpeg'),
        }
    }