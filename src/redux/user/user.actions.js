import { UserActionTypes } from './user.types';
import apiConnect from '../../api/connect';

export const setCurrentUser = user => ({
    type: UserActionTypes.SET_CURRENT_USER,
    payload: user
})

export const logOutUser = () => ({
    type: UserActionTypes.SET_CURRENT_USER,
    payload: null
})

export const setLoginError = (errorMessage) => ({
    type: UserActionTypes.SET_LOGIN_ERROR,
    payload: errorMessage
})

export const clearLoginError = () => ({
    type: UserActionTypes.SET_LOGIN_ERROR,
    payload: ''
})