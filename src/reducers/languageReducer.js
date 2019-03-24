import { SELECT_LANGUAGE } from '../actions/types';

const INITIAL_STATE = { selected_lang:{}};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SELECT_LANGUAGE :
            return {
                ...state,
              selected_lang: action.payload
            };

        default :
            return state;
    }
}
