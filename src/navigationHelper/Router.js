import {createRouter} from '@expo/ex-navigation';
import React from 'react';

import mainscreen from '../components/Drawer'
import homescreen from '../components/homeScreen'
import firstscreen from '../components/firstscreen';
import secondscreen from '../components/secondscreen';
import register from '../components/register';
import signin from "../components/signin";
import videodetailedview from '../components/videoDetailedView';
import stores from '../components/store';
import sites from "../components/sites";
import footsteps from "../components/footSteps";
import sett from '../components/settings'
import about from '../components/aboutView';
import changepass from '../components/changePassword';
import changeLang from '../components/changeLang';
import myPack from '../components/myPack';
import myPack1 from '../components/myPack1';
import termsAndPolicy from '../components/termsAndPolicy';
import transcript from '../components/transcript';
import couponcode from '../components/couponcode';
import couponRedeemed from '../components/couponRedeemed';

export default createRouter(() => ({

    mainscreen: () => mainscreen,
    homescreen: () => homescreen,
    firstscreen: () => firstscreen,
    secondscreen: () => secondscreen,
    register: () => register,
    signin: () => signin,
    videodetailedview: () => videodetailedview,
    stores: () => stores,
    sites: () => sites,
    footsteps: () => footsteps,
    sett: () => sett,
    about: () => about,
    changepass: () => changepass,
    changeLang: () => changeLang,
    myPack: () => myPack,
    myPack1: () => myPack1,
    transcript: () => transcript,
    termsAndPolicy: () => termsAndPolicy,
    couponcode: () => couponcode,
    couponRedeemed: () => couponRedeemed,

}),{ignoreSerializableWarnings: true});
