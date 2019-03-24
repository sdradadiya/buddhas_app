/**
 * Created by developer91 on 4/19/17.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    Platform
} from 'react-native';
const baseURL = "http://lanetteam.com:8080";
const storeScreenWidth=Dimensions.get('window').width;
module.exports = {

    screen: Dimensions.get('window'),
    screenHeight:  Dimensions.get('window').height,
    screenWidth:  Dimensions.get('window').width,
    storeScreen: (storeScreenWidth*100)/375,
    sitesHeight: (storeScreenWidth*210)/375,
    lightBlueColor: 'rgb(34,122,176)',
    darkRedColor: 'rgb(243,38,2)',
    lightGreenColor: 'rgb(67,135,102)',
    lightYellowColor: 'rgb(255,176,57)',
    tableGroupColor: 'rgb(219,219,224)',
    greenColor: 'rgb(0,170,25)',
    tableSeparatorColor: 'rgb(206,206,206)',
    underLineColor: 'transparent',
    lightGrayFontColor: 'rgb(161,161,161)',
    lightBlueFontColor: 'rgb(42,142,242)',
    defaultBlue: 'rgb(0,128,255)',
    themColor: '#FFCC29',
    orangeColor: '#fbb043',

    Views: {
        SignIn: 'SignIn',
        SignUp: 'SignUp',
        ParentCompany: 'ParentCompany',
        RoofTop: 'RoofTop',
        HomePage: 'HomePage',
        Dashboard: 'Dashboard',
        InventoryDetail: 'InventoryDetail',
        InventoryList: 'InventoryList',
        CustomerForm: 'AddCustomerForm',
        CustomerList: 'CustomerList',
        ComingSoon: 'ComingSoon',
        InventoryMediaDetail: 'InventoryMediaDetail',
        InventoryCameraComponent: 'InventoryCameraComponent',
        InventoryVideoComponent: 'InventoryVideoComponent',
        CustomerDetail: 'CustomerDetail',
    },

    alertTitle: 'Citrus Ventrues',
    ServerError: 'Internal server error',

    IOS: Platform.OS === 'ios',
    ANDROID: Platform.OS === 'android',

    playingState: (Platform.OS === 'ios') ? "STATE_PLAYING" : 3,

    navButtonType:{
        back: 'Back',
        menu: 'Menu',
        menuBack: 'MenuBack'
    },

url: {
    mainURL: "http://lanetteam.com:8080",
    login: baseURL+"/auth/local",
    projects: baseURL+"/api/projects",
    forgotPassword: baseURL+"/api/users/forgot"
},
  fontNotoR: (Platform.OS === 'android') ? 'Noto Sans': 'NotoSans',
  fontNotoB: (Platform.OS === 'android') ? 'Noto Sans Bold' : 'NotoSans-Bold',
};