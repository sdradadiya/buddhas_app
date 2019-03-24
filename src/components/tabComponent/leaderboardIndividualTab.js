import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    TouchableHighlight
} from 'react-native';
import Constant from '../../helper/constants';
import LeaderBoardRow from '../tabComponent/leaderBoardRow'
import TabLabelComponent from './tabLabelComponent';
import {mainFiles,getIndex} from "../../helper/commonFunctions";
import {connect} from 'react-redux';

let isLabelClicked = false;

class leaderboardIndividualTab extends Component {

    constructor(props){
        super(props);

        this.state={
            countshow:this.props.items[0].displayName,
        }
    }

    labelClicked = (stateLabel, imageScroll) => {

      if(imageScroll){
          isLabelClicked = true;
        this.refs.labelList.scrollTo({x:(Constant.screenWidth/3)*stateLabel,y:0,animated:true});
        this.refs.imageList.scrollTo({x:(Constant.screenWidth)*stateLabel,y:0,animated:true});
        isLabelClicked = false
      }else{
        isLabelClicked = false;
        this.refs.labelList.scrollTo({x:(Constant.screenWidth/3)*stateLabel,y:0,animated:true});
      }

      this.setState({
            countshow: this.props.items[stateLabel].displayName
        });
      this.props.getTabItem(stateLabel)
    };

  componentWillReceiveProps(nextProps) {

    if (nextProps.itemIndex && nextProps.itemIndex > this.props.itemIndex) {
      this.labelClicked(nextProps.itemIndex, true)
    }

  }


  onScrollEnd = (e) => {

    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    if(!isLabelClicked){
      this.labelClicked(pageNum, false);
    }

  };

  renderLabels = () => {
    var that = this;

   return this.props.items.map((label,index) => {
      return <TabLabelComponent key={index} text={(label.displayName)?label.displayName:""}
                                labelClicked={() => that.labelClicked(index, true)}
                                currentLabel={this.state.countshow}/>
    })
  }
  renderImages = () => {
    var that = this;

   return this.props.items.map((label,index) => {
       debugger
      return <LeaderBoardRow key={index} name={(label.siteId)?label.displayName:"no siteName"}
                             uri={mainFiles[getIndex(this.props.selected_lang.language,label.siteId.name,"siteImageURL")]}/>
    })
  }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView horizontal={true} bounces={false}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false} showsVerticalScrollIndicator={false}
                            ref="labelList">
                    <TabLabelComponent />

                  {
                    this.renderLabels()
                  }
                    <TabLabelComponent/>
                </ScrollView>
                <View style={{backgroundColor:'rgba(107,192,248,1)',width:Constant.screenWidth/4,
                margin:2,padding:1,marginBottom:10,alignSelf:'center',borderRadius:20}}/>
                <ScrollView ref="imageList"
                            bounces={false}
                            pagingEnabled={true}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            onScroll={this.onScrollEnd}
                            scrollEventThrottle={1}>
                  {
                    this.renderImages()
                  }
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15
    },
    content: {
        textAlign: 'center',
        color: '#FFFFFF',

    },
});
mapStateToProps = state => {
    const { selected_lang } = state.selectedLang;

    return {
        selected_lang
    }
};
export default connect(mapStateToProps, {
})(leaderboardIndividualTab);


