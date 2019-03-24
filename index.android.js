import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import Main from './src/main'

AppRegistry.registerComponent('buddhas', () => Main);
AppRegistry.registerHeadlessTask('TrackPlayer', () => require('./src/player-handler.js'));