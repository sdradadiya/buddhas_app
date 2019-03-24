import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { NavigationReducer, createNavigationEnabledStore } from '@expo/ex-navigation';
import loginReducer from '../reducers/loginReducer';
import registerReducer from '../reducers/registerReducer';
import languageReducer from '../reducers/languageReducer';
import playerReducer from '../reducers/playerReducer';

import {persistStore, autoRehydrate} from 'redux-persist';
import {AsyncStorage} from 'react-native'

const createStoreWithNavigation = createNavigationEnabledStore({
  createStore,
  navigationStateKey: 'navigation',
});

let reducer = combineReducers({
  player: playerReducer,
  userRegisterForm: registerReducer,
  userLoginForm: loginReducer,
  selectedLang: languageReducer,
  navigation: NavigationReducer,
})
const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
      debugger
        state = {
            navigation: state.navigation
        }
    }

    return reducer(state, action)
}

const createMyStore = applyMiddleware(ReduxThunk)(createStoreWithNavigation);
export default (onComplete: ?() => void) => {
  let store;

  store = autoRehydrate()(createMyStore)(rootReducer);

  persistStore(store, { storage: AsyncStorage }, onComplete);

  return store;
};
/*import { createNavigationEnabledStore } from '@expo/ex-navigation';
import {persistStore, autoRehydrate} from 'redux-persist';
import { AsyncStorage } from 'react-native';

const middleware = [ thunk ];

const createStoreWithNavigation = createNavigationEnabledStore({
    createStore,
    navigationStateKey: 'navigation',
});

const Store = createStoreWithNavigation(
  reducer,
  {},
  compose(
    applyMiddleware(thunk),
    autoRehydrate()
  )
);
persistStore(Store, {storage: AsyncStorage});

export default Store;
*/