import {
    StackNavigation,
    DrawerNavigation,
    DrawerNavigationItem,
    NavigationStyles,
} from '@expo/ex-navigation';
import React from 'react';
import { Image, Text, View, StyleSheet,TouchableHighlight,TextInput,ScrollView ,FlatList,Dimensions,BackHandler} from 'react-native';

import cs from '../helper/customStyles';
import {Icon} from 'react-native-elements';

import { Container, Content, Grid, Col, Row, List, ListItem, Input } from 'native-base';
import Router from '../navigationHelper/Router';
import Constant from '../helper/constants';
import csFont from '../helper/fontsize';
import strings from '../helper/language';
import Setting from '../components/settings'
import { showPlayerComponent } from '../actions/playerAction'
import {connect} from 'react-redux';


const width=Dimensions.get('window').width;
const iconSize=(width*20)/326;

class DrawerNavigationLayout extends React.Component {

    constructor(props){
        super(props);
        this.state = {

            isFirst: (this.props.route.params.isFirst !== undefined)?this.props.route.params.isFirst:true
        }
    }

    handleBackPress1 = () => {
        BackHandler.exitApp();
        return true
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress1', this.handleBackPress1);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress1', this.handleBackPress1);
    }

    static route = {
        navigationBar: {
            visible: false,
        }
    };

    closePressed = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigator('mainDrawer');
        navigator.toggleDrawer()
    };

    render() {
        return (
            <DrawerNavigation
                id='mainDrawer'
                navigatorUID="drawerNav"
                initialItem='home'
                drawerWidth={Constant.screenWidth}
                renderHeader={this._renderHeader}
            >
                <DrawerNavigationItem
                    id='home'
                    selectedStyle={styles.selectedItemStyle}
                    renderTitle={isSelected => this._renderTitle(strings.home, isSelected)}
                >
                    <StackNavigation
                        id='home'
                        initialRoute={Router.getRoute('homescreen',{isFirst: this.state.isFirst})}
                        defaultRouteConfig={{
                            navigationBar: {
                                visible: false,
                            },
                            styles: {
                                ...NavigationStyles.SlideHorizontal,
                            }

                        }}/>
                </DrawerNavigationItem>
                <DrawerNavigationItem
                    id='allsites'
                    selectedStyle={styles.selectedItemStyle}
                    renderTitle={isSelected => this._renderTitle(strings.site, isSelected)}
                >
                    <StackNavigation
                        id='allsites'
                        initialRoute={Router.getRoute('sites')}
                        defaultRouteConfig={{
                            navigationBar: {
                                visible: false,
                            },
                            styles: {
                                ...NavigationStyles.SlideHorizontal,
                            }

                        }}/>
                </DrawerNavigationItem>
                <DrawerNavigationItem
                    id='footsteps'
                    selectedStyle={styles.selectedItemStyle}
                    renderTitle={isSelected => this._renderTitle(strings.Footsteps, isSelected)}
                >
                    <StackNavigation
                        id='footsteps'
                        initialRoute={Router.getRoute('footsteps')}
                        defaultRouteConfig={{
                            navigationBar: {
                                visible: false,
                            },
                            styles: {
                                ...NavigationStyles.SlideHorizontal,
                            }

                        }}/>
                </DrawerNavigationItem>
                <DrawerNavigationItem
                    id='store'
                    selectedStyle={styles.selectedItemStyle}
                    renderTitle={isSelected => this._renderTitle(strings.store, isSelected)}
                >
                    <StackNavigation
                        id='store'
                        initialRoute={Router.getRoute('stores')}
                        defaultRouteConfig={{
                            navigationBar: {
                                visible: false,
                            },
                            styles: {
                                ...NavigationStyles.SlideHorizontal,
                            }

                        }}/>
                </DrawerNavigationItem>
                <DrawerNavigationItem
                    id='My Packs'
                    selectedStyle={styles.selectedItemStyle}
                    renderTitle={isSelected => this._renderTitle(strings.myPacks, isSelected)}
                >
                    <StackNavigation
                        id='My Packs'
                        initialRoute={Router.getRoute('myPack')}
                        defaultRouteConfig={{
                            navigationBar: {
                                visible: false,
                            },
                            styles: {
                                ...NavigationStyles.SlideHorizontal,
                            }

                        }}/>
                </DrawerNavigationItem>
                <DrawerNavigationItem
                    id='settings'
                    selectedStyle={styles.selectedItemStyle}
                    renderTitle={isSelected => this._renderTitle(strings.settings, isSelected)}
                >
                    <Setting {...this.props}/>
                </DrawerNavigationItem>
            </DrawerNavigation>
        );
    }

    _renderHeader = () => {
        return (
            <View style={styles.header}>
                <Icon type='font-awesome' name='close' size={27} color='#000' style={[cs.jcCenter,{padding:25}]}
                      onPress={() => this.closePressed()}/>
            </View>
        );
    };



    getIcon = (title) =>{
        if (title === strings.home){
            return <Icon type='font-awesome' name='home' size={iconSize} color='#000' />
        }
        if (title === strings.site){
            return <Icon type='font-awesome' name='paper-plane' size={iconSize-5} color='#000'/>
        }
        if (title === strings.Footsteps){
            return <Icon type='font-awesome' name='street-view' size={iconSize} color='#000'/>
        }
        if (title === strings.store){
            return <Icon type='font-awesome' name='shopping-cart' size={iconSize} color='#000'/>
        }
        if (title === strings.myPacks){
            return <Icon type='font-awesome' name='download' size={iconSize} color='#000'/>
        }
        if (title === strings.settings){
            return <Icon type='font-awesome' name='gears' size={iconSize} color='#000'/>
        }
    };

    _renderTitle(text: string, isSelected: boolean) {
        return (
            <Row style={{paddingLeft: 10,paddingRight: 0,paddingTop: 0,paddingBottom: 0,marginLeft: 10}}>
                <Col size={1} style={[cs.jcCenter]}>
                    {this.getIcon(text)}
                </Col>
                <Col size={4} style={[cs.pl1,cs.jcCenter]}>
                    <Text style={[cs.colorA8, csFont.MEDIUM_FONT, {color:'#000', fontFamily: Constant.fontNotoR}]}>{text}</Text>
                </Col>
            </Row>
        );
    };
}


const styles = StyleSheet.create({
    header: {
        height: 45,
        alignItems: 'flex-end',
        backgroundColor: '#fff'
    },

    selectedItemStyle: {
    },

    titleText: {
        fontWeight: 'bold'
    },

    selectedTitleText: {
        color: 'white'
    }
});
mapStateToProps = state => {
    const { player } = state.player;

    return {
        player
    }
};

export default connect(mapStateToProps, {
    showPlayerComponent
})(DrawerNavigationLayout);

