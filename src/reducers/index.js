// import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
// import ReduxThunk from 'redux-thunk';
// import { NavigationReducer, createNavigationEnabledStore } from '@expo/ex-navigation';
// import loginReducer from './loginReducer';
// import registerReducer from './registerReducer';
// import languageReducer from './languageReducer';
//
// const createStoreWithNavigation = createNavigationEnabledStore({
//     createStore,
//     navigationStateKey: 'navigation',
// });
//
// const Store = createStoreWithNavigation(
//     combineReducers({
//         userRegisterForm: registerReducer,
//         userLoginForm: loginReducer,
//         selectedLang: languageReducer,
//         navigation: NavigationReducer,
//     }),
//
//     applyMiddleware(ReduxThunk),
//     // other store enhancers if any
//
// );
// export default Store;
