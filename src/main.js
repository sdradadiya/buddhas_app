import React, {Component} from 'react';
import { View} from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/config';
import Router from './navigationHelper/Router'
import {StackNavigation, NavigationProvider,NavigationStyles, NavigationContext} from '@expo/ex-navigation';
import Navigation from './navigation'
console.disableYellowBox = true;

class CustomNavigationContext extends NavigationContext {

  showModal(initialRouteName, initialRouteParams = {}) {
    const initialRoute = Router.getRoute(initialRouteName, initialRouteParams);
    const rootNavigator = this.getNavigator('root');
    const route = Router.getRoute('modal', { initialRoute });
    rootNavigator.push(route);
  }

  dismissModal() {
    const rootNavigator = this.getNavigator('root');
    rootNavigator.pop();
  }

}


export default class main extends Component {
  constructor(props){
    super(props);
    this.state={
      isLoading:true,
      store:Store(()=>{this.setState({isLoading:false})})
    }
  }
  render(){
    const { isLoading, store } = this.state;
    if (isLoading) {
      return null;
    }
    const navigationContext = new CustomNavigationContext({
      Router,
      store,
    });

    return(
      <Provider store={store}>
        <NavigationProvider router={Router}  context={navigationContext}>
          <Navigation/>
        </NavigationProvider>

      </Provider>
    );
  }
}