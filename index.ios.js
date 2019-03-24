import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import Main from './src/main'

export const path = '../../images/uploads/1/allSiteImage.jpeg'

AppRegistry.registerComponent('buddhas', () => Main);
AppRegistry.registerHeadlessTask('TrackPlayer', () => require('./src/player-handler.js'));