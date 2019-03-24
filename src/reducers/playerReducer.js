import {
    SET_CURRENT_AUDIO,
    SHOW_AUDIO_PLAYER,
    SET_PLAYER_VALUES
} from '../actions/types'

const INITIAL_STATE = {
    player:{
        playerURL: '',
        playerImage: '',
        playerText: '',
        currentTime: 0,
        duration: 0,
        seekTotime: 0,
        playingAudio: false,
        isFirst: false
    },
    showPlayer: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case SET_CURRENT_AUDIO: {
            return {
                ...state,
                player: action.payload,
            }
        }
        case SET_PLAYER_VALUES: {
            return {
                ...state,
                player: {
                    ...state.player,
                    [action.payload.prop] : action.payload.value
                },
            }
        }
        case SHOW_AUDIO_PLAYER: {
            return {
                ...state,
                showPlayer: action.payload,
            }
        }
        default :
            return state;
    }
}
