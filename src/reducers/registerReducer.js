import {USER_REGISTER_UPDATE, USER_CREATE, } from '../actions/types';

const INITIAL_STATE = { email:'', password:'', repassword:'', coupon:'', };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_REGISTER_UPDATE :
            return { ...state, [action.payload.prop] : action.payload.value };

        case USER_CREATE :
            return { ...state, INITIAL_STATE };

      default :
            return state;
    }
}

