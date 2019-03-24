import {
    SET_CURRENT_AUDIO,
    SHOW_AUDIO_PLAYER,
    SET_PLAYER_VALUES
} from './types'
import {AsyncStorage} from 'react-native';

export const setCurrentAudio = (player) => {
    return {
        type: SET_CURRENT_AUDIO,
        payload: player
    }
};

export const showPlayerComponent = (show) => {
    return {
        type: SHOW_AUDIO_PLAYER,
        payload: show
    }
};
export const setPlayerValues = ({prop, value}) => {
    return {
        type: SET_PLAYER_VALUES,
        payload: {prop, value}
    }
};


