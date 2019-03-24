import React,{ Component} from 'react';
import {ScrollView,View, StyleSheet, Text, Image, TouchableHighlight, Alert} from 'react-native';
import {NavigationStyles} from '@expo/ex-navigation';
import NavigationBar from './NavigationBar';
import strings from '../helper/language';
import cs from '../helper/customStyles';
import Constant from '../helper/constants';
import {showAlert} from '../helper/commonFunctions';
import font  from '../helper/fontsize';
import { getStorePacks,setFilePath,addPack,setStorePack } from '../actions/loginAction'
import { showPlayerComponent } from '../actions/playerAction'
import {connect} from 'react-redux';
import Spinner from './loader'
import TrackPlayer from 'react-native-track-player'
import {
    withNavigation,
    createFocusAwareComponent
} from '@expo/ex-navigation/src/ExNavigationComponents'
import {Icon} from 'react-native-elements';
import Router from '../navigationHelper/Router';
import { NativeModules } from 'react-native'
const { InAppUtils } = NativeModules;
import InAppBilling from 'react-native-billing'

type Props = {
    isFocused: boolean,
};

@createFocusAwareComponent
@withNavigation

class Store extends Component{
    constructor(props) {
        super(props);


        this.state = {
            isLoading: false,
            purchaseText: "Purchasing testeyrerye product",
            productDetailsText: "Getting werwerwyreyproduct details",
            error: "None",
            otherPackList : props.storePacks,
            selectedPack : {}
        };
    }
    componentWillMount(){
        TrackPlayer.getState().then((state) => {
            if(state === Constant.playingState){
                this.props.showPlayerComponent(true)
            }
        })
        this.getstoreData()
    }
    componentDidMount () {

    }
    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.isFocused && !this.props.isFocused) {
            TrackPlayer.getState().then((state) => {
                if(state === Constant.playingState){
                    this.props.showPlayerComponent(true)
                }
            })
            this.getstoreData()
        } else if (!nextProps.isFocused && this.props.isFocused) {
        }
    }



    async payAndroid(packToBuy) {
        this.setState({
            isLoading: true
        });

        let productId = packToBuy.packIdAndroid;
        // let productId = this.gettProductId(packToBuy.language);

        await InAppBilling.close();
        try {
            await InAppBilling.open();
            if (!await InAppBilling.isPurchased(productId)) {
                const paymentDetails = await InAppBilling.purchase(productId);
                console.log('You purchased: ', paymentDetails);

                if(paymentDetails && paymentDetails.purchaseState === "PurchasedSuccessfully"){
                    //call Api for adding pack

                    this.props.addPack(packToBuy._id).then((res) => {
                        this.setState({
                            isLoading: false
                        });
                        this.setStoreData()
                        // showAlert("Pack is Purchased")
                    }).catch((err) => {
                        this.setState({
                            isLoading: false
                        });
                        // showAlert("Error purchasing pack")
                    })
                }

            }

        } catch (err) {
            console.log(err);

        } finally {
            this.setState({
                isLoading: false
            })
            await InAppBilling.consumePurchase(productId);
            await InAppBilling.close();
        }
    }
    payIOS = (packToBuy) => {

        this.setState({
            isLoading: true
        });

        // let productId = packToBuy.packIdIOS;
        // InAppUtils.canMakePayments((canMakePayments) => {
        //     if(!canMakePayments) {
        //         this.setState({
        //             isLoading: false
        //         });
        //
        //
        //         Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
        //     }else{
        //         InAppUtils.purchaseProduct(productId, (error, response) => {
        //             // NOTE for v3.0: User can cancel the payment which will be available as error object here.
        //             console.log("IAP response::::", response)
        //
        //             if(response && response.productIdentifier) {
        //                 console.log('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
        //                 //unlock store here.
        //                 debugger
                        this.props.addPack(packToBuy._id).then((res) => {
                            debugger
                            this.setState({
                                isLoading: false
                            });
                            this.setStoreData()
                            //showAlert("Pack is Purchased")
                        }).catch((err) => {

                            this.setState({
                                isLoading: false
                            });

                            showAlert("Error purchasing pack")
                        })

        //             }else {
        //                 this.setState({
        //                     isLoading: false
        //                 });
        //                 console.log("IAP error::::")
        //
        //                 Alert.alert("error purchase")
        //             }
        //         });
        //     }
        // })

    }



    async getProductsForAndroid(productLanguage) {

        InAppBilling.open()
            .then(() => {

                InAppBilling.getProductDetails('android.test.purchased')
            })
            .then((details) => {


                console.log("You purchased: ", details)
                InAppBilling.close()
                return Promise.resolve(details.priceText)

            }).catch((err) => {

        });


    }

    getProductsFromConsole = async(tempPack) => {
        debugger

        let tempArr = []
        try {
            await InAppBilling.open();
            InAppBilling.getProductDetailsArray(tempPack)
                .then(res => {

                    res.map(product => {
                        let obj = {
                            id:product.productId,
                            price:product.priceText
                        }
                        tempArr.push(obj);
                    })

                    return Promise.resolve(tempArr);
                })
                .catch(err => {

                    return Promise.reject()
                })
        }
        catch (ex){
            console.log(err)
        }
        finally {

            await InAppBilling.close();
            return Promise.resolve(tempArr);
        }

    }

    getProductsFromConsoleIOS = (tempPack) => {
        debugger
        var products = tempPack
        let tempArr = []

        // return InAppUtils.loadProducts(products).then(products=>{
        //
        //     products.map(product => {
        //         let obj = {
        //             id:product.title,
        //             price:product.priceString
        //         }
        //         tempArr.push(obj);
        //     })
        //
        //     return Promise.resolve(tempArr)
        // }).catch(err=>{
        //     return Promise.reject("no data")
        // });
        return new Promise((resolve, reject) => {
            return InAppUtils.loadProducts(products, (error, products) => {
                //update store here.

                debugger

                if (error) {
                    debugger
                    console.log("Error loading product"+error)
                    return reject("no data")

                } else {
                    debugger
                    products.map(product => {
                        let obj = {
                            id:product.identifier,
                            price:product.priceString
                        }
                        tempArr.push(obj);
                    })

                    return resolve(tempArr)
                }
            });
        });

    }

    getstoreData = () => {
        this.setState({
            isLoading: true
        })
        let tempPack = []
        let tempPackIds = []
        this.props.getStorePacks().then((response) => {
            response.map(packObj => {
                debugger
                tempPackIds.push((Constant.ANDROID)&&packObj.packIdAndroid||packObj.packIdIOS)
            });
            debugger
            if(Constant.ANDROID){
                this.getProductsFromConsole(tempPackIds).then(res => {

                    debugger
                    let packsWithNewPrice = []

                    response.map(pack => {

                        let packId = pack.packIdAndroid
                        let index = _.findIndex(res,{id: packId})
                        if(index>-1){
                            pack.price = res[index].price
                        }
                        if (pack.isSelected){
                            this.setState({
                                selectedPack:pack
                            })
                        }else {
                            tempPack.push(pack)
                        }
                        debugger
                        packsWithNewPrice.push(pack)
                    });
                    this.setState({
                        isLoading: false,
                        otherPackList:tempPack
                    })

                    this.props.setStorePack(packsWithNewPrice)
                    debugger

                }).catch(err => {
                    debugger
                    console.log("error",err)
                    response.map(pack => {
                        if (pack.isSelected){
                            this.setState({
                                selectedPack:pack
                            })
                        }else {
                            tempPack.push(pack)
                        }
                    });
                    this.setState({
                        isLoading: false,
                        otherPackList:tempPack
                    })
                })

            }else{
                debugger
                this.getProductsFromConsoleIOS(tempPackIds).then(res => {

                    debugger
                    let packsWithNewPrice = []

                    response.map(pack => {

                        debugger
                        let packId = pack.packIdIOS
                        let index = _.findIndex(res,{id: packId})
                        if(index>-1){
                            pack.price = res[index].price
                        }
                        if (pack.isSelected){
                            this.setState({
                                selectedPack:pack
                            })
                        }else {
                            tempPack.push(pack)
                        }
                        debugger
                        packsWithNewPrice.push(pack)
                    });
                    this.setState({
                        isLoading: false,
                        otherPackList:tempPack
                    })

                    this.props.setStorePack(packsWithNewPrice)

                    debugger

                }).catch(err => {
                    debugger
                    console.log("error",err)
                    response.map(pack => {
                        if (pack.isSelected){
                            this.setState({
                                selectedPack:pack,
                                isLoading: false
                            })
                        }else {
                            tempPack.push(pack)
                        }
                    });
                    this.setState({
                        isLoading: false,
                        otherPackList:tempPack
                    })
                })
            }

        }).catch((err) => {
            debugger
            this.setState({
                isLoading: false
            })
            this.setStoreData()
        })

    }

    setStoreData = () => {
        let tempPack = []

        this.props.storePacks.map(pack => {
            debugger
            if (pack.isSelected){
                this.setState({
                    selectedPack:pack
                })
            }else {
                tempPack.push(pack)
            }

        })
        debugger
        this.setState({
            isLoading: false,
            otherPackList:tempPack
        })

    }
    buyPack = (owned,packToBuy) => {

        debugger
        if(owned){
            showAlert(packToBuy.name+" is already Owned")
        }
        else{
            Alert.alert("",
                "Continue to purchase "+packToBuy.name+"?",
                [
                    {text: 'Yes', onPress: () => {
                        if(Constant.ANDROID){
                            let pay = this.payAndroid(packToBuy)
                        }else{
                            // configure for IOS in App purchase
                            this.payIOS(packToBuy)
                        }
                    }},
                    {text: 'No', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            );
        }
    }

    renderSelectedPack = (selectedPack) => {
        return(
            <View style={[cs.bg000,{shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2}]}
                  elevation={15}>
                <TouchableHighlight underlayColor={'transparent'}
                                    onPress={() => {
                                        this.buyPack(selectedPack.isOwned,selectedPack)
                                    }}>

                    <View style={styles.mainView}>
                        <View style={styles.img}>
                            <Image source={require('../../images/buddhas.png')} style = {{
                                width: Constant.screenWidth/2.5,
                                height: Constant.screenWidth/2.5
                            }} />
                        </View>
                        <View style={{flex:1,padding:10,justifyContent:'space-between'}}>
                            <View>
                                <Text style={[font.XLMEDIUM_FONT,{color:'#000',fontFamily: Constant.fontNotoR, marginBottom:5}]}>
                                    {strings.in+ ' ' +strings.buddha+ ' ' +strings.footsteps}
                                </Text>
                                <Text style={[font.MEDIUM_FONT,{color:'#000', fontFamily: Constant.fontNotoB, marginBottom:5}]}>
                                    {selectedPack.name}
                                </Text>
                                <Text style={[font.SMALL_FONT,{color:'#000', fontFamily: Constant.fontNotoR, marginBottom:5}]}>
                                    {"Sites includes:\n" +selectedPack.includedSites}
                                </Text>
                            </View>
                            <Text style={[font.TITLE_FONT, {color:'rgba(15,102,177,1)',fontFamily: Constant.fontNotoB, alignSelf:'flex-end'}]}>
                                {(selectedPack.isOwned)?"Owned":selectedPack.price}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>

            </View>
        )
    }
    setSelectedPack = (index) => {
        let newSelectedPack = this.state.otherPackList[index];
        newSelectedPack.isSelected = true;
        let oldSelectedPack = this.state.selectedPack;
        oldSelectedPack.isSelected = false;
        let otherarr =[];
        otherarr.push(oldSelectedPack);
        this.state.otherPackList.map(pack=> {
            if(pack._id === newSelectedPack._id){

            }else {
                otherarr.push(pack)
            }
        });
        this.setState({
            otherPackList:otherarr,
            selectedPack:newSelectedPack
        },() => {
            let packs = _.cloneDeep(otherarr)
            packs.push(newSelectedPack);
            this.props.setStorePack(packs)
        });


    }

    renderStoreData = (packs) => {
        return packs.map((pack,index) => {

            // let ind = _.findIndex(this.props.currentPacks,{_id:pack._id})
            // let owned = false
            // if(ind>-1){
            //     owned = true
            // }
            return (
                <TouchableHighlight  key={pack._id} onPress={()=>{
                    this.setSelectedPack(index)
                }} underlayColor={'transparent'}>

                    <View style={styles.mainView}>
                        <View style={styles.img}>
                            <Image source={require('../../images/buddhas.png')} style = {{
                                width: Constant.screenWidth/3.5,
                                height: Constant.screenWidth/3.5
                            }} />
                        </View>
                        <View style={{flex:1,padding:10,justifyContent:'space-between'}}>
                            <View>
                                <Text style={[font.XLMEDIUM_FONT,{color:'#000',fontFamily: Constant.fontNotoR}]}>
                                    {strings.in+ ' ' +strings.buddha+ ' ' +strings.footsteps}
                                </Text>
                                <Text style={[font.MEDIUM_FONT,{color:'#000', fontFamily: Constant.fontNotoB}]}>
                                    {pack.name}
                                </Text>
                            </View>
                            <Text style={[font.TITLE_FONT, {color:'rgba(15,102,177,1)',fontFamily: Constant.fontNotoB, alignSelf:'flex-end'}]}
                                  onPress={() => {
                                      this.buyPack(pack.isOwned,pack)
                                  }}>
                                {(pack.isOwned)?"Owned":pack.price}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        });
    }

    menuPressed = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.toggleDrawer()
    };
    backtoHome = () => {
        const { navigation } = this.props;
        const navigator = navigation.getNavigatorByUID('drawerNav');
        navigator.setActivateItemCustom("home",0)
    };

    /* <View style={[cs.bg000,{shadowColor: '#000000',
                        shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2,marginTop:10,marginBottom:10}]}
                          elevation={(this.state.isLoading)?0:5}>
                    <TouchableHighlight underlayColor='transparent'
                                        onPress={() => {
                                            this.props.navigator.push(Router.getRoute("couponcode"))
                                        }
                                        }>
                        <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:'row',paddingRight:10,paddingLeft:10,paddingBottom:15,paddingTop:15}}>
                            <Text style={[font.MEDIUM_FONT,{ alignSelf: 'center', color:'rgb(18,143,212)',fontFamily:Constant.fontNotoR}]}>
                                Redeem Coupon</Text>

                            <Icon
                                name={'angle-right'}
                                type={'font-awesome'}
                                size={25}
                                color={'rgb(18,143,212)'}/>
                        </View>
                    </TouchableHighlight>
                    </View>*/
    render(){
        return(
            <View style={{flex:1}}>
                <NavigationBar
                    navTitle={strings.store}
                    leftButtonPressed = { this.backtoHome }
                    leftButtonPressedMenu = { this.menuPressed }
                    leftButtonType = {Constant.navButtonType.menuBack}
                />


                {
                    (this.state.selectedPack)?
                        <ScrollView>
                            {this.renderSelectedPack(this.state.selectedPack)}
                            {
                                (this.state.otherPackList.length > 0)?
                                    <View>
                                        <Text style={[font.XLMEDIUM_FONT, {
                                            color: '#000',
                                            fontFamily: Constant.fontNotoB,
                                            marginLeft: 10,
                                            marginTop: 25
                                        }]}>
                                            Other Language Packs</Text>
                                        <View style={{height:1,backgroundColor:'lightgray',marginTop:10,marginBottom:5}}/>
                                        {this.renderStoreData(_.cloneDeep(this.state.otherPackList))}
                                    </View>:
                                    <View/>
                            }
                        </ScrollView>
                        :
                        <View style={ [styles.containers,{height:'100%',width:'100%'}]}>
                            <Text style={[font.MEDIUM_FONT,{ alignSelf: 'center', color:'#000',fontFamily:Constant.fontNotoB}]}>
                                {strings.noData}</Text>
                        </View>
                }

                <Spinner visible={this.state.isLoading}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    containers: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    mainView:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'lightgray',
    },
    img:{
        padding:10,
        paddingRight:0
    },
    titleText:{
        padding:10,
        paddingLeft:0,
    },
    titleTextLast:{
        flex:1,
        marginRight:10,
        marginBottom:10,
    }
});

mapStateToProps = state => {
    return {
        currentPacks: state.userLoginForm.currentPacks,
        allPacks: state.userLoginForm.allPacks,
        storePacks: state.userLoginForm.storePacks,
        user: state.userLoginForm.user
    }
};

export default connect(mapStateToProps, {
    getStorePacks,setFilePath,addPack,showPlayerComponent,setStorePack
})(Store);