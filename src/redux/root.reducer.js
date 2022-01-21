import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/user.reducer';
import expireIn from "redux-persist-transform-expire-in";
import templatesReducer from './templates/templates.reducer';

const expire = 1 * 20 * 60 * 1000; //30 minutes
const expirationKey = "aledoy_email_app_expiration_key";

const persistConfig = {
    key: 'aledoy_email_epp',
    storage,
    whitelist: ['user', 'templates'],
    transforms: [expireIn(expire, expirationKey, [{
        currentUser: null,
        loginError: ''
    }])],
    blacklist: ['cart']
}

const rootReducer = combineReducers({
    user: userReducer,
    templates: templatesReducer
});

export default persistReducer(persistConfig, rootReducer);