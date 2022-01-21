import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
    currentUser: null,
    loginError: ''
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case UserActionTypes.SET_CURRENT_USER:
            return{
                ...state,
                currentUser: action.payload
            }
        case UserActionTypes.SET_LOGIN_ERROR:
            return{
                ...state,
                loginError: action.payload
            }
        default: 
            return state
    }
}

export default userReducer;