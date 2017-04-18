/*
 * description: 单个榜单详情(自家)
 * author: 麦芽糖
 * time: 2017年04月06日11:56:52
 */

import React, { Component } from 'react'
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ListView
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import TabBarOnlyText from '../../weight/TabBarOnlyText'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import BookDetail from '../bookDetail'
import ChartsDetailTab from './chartsDetailTab'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabNames = ['周榜', '月绑', '总榜']

export default class ChartsDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  componentDidMount() {
  }

  _back() {
    this.props.navigator.pop()
  }
 
  render() {
    const {charts} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>{this.props.chartsItem.title}</Text>
          <Icon 
            name='ios-cloud-download-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appMainColor}/>
        </View>
        <ScrollableTabView
          scrollWithoutAnimation={true}
          tabBarPosition={'top'}
          renderTabBar={() => <TabBarOnlyText tabNames={tabNames}/>}>
          <ChartsDetailTab 
            chartsId={this.props.chartsItem._id} 
            tabLabel="周榜" 
            navigator={this.props.navigator} />
          <ChartsDetailTab 
            chartsId={this.props.chartsItem.monthRank} 
            tabLabel='月绑' 
            navigator={this.props.navigator} />
          <ChartsDetailTab 
            chartsId={this.props.chartsItem.totalRank} 
            tabLabel='总榜' 
            navigator={this.props.navigator} />
        </ScrollableTabView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground
  },
  header: {
    height: config.css.headerHeight,
    paddingTop: config.css.statusBarHeight,
    backgroundColor: config.css.color.appMainColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcon: {
    marginLeft: 14,
    marginRight: 14
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.appTitle
  }
})
