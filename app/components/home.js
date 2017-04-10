/*
 * description: app首页
 * author: 麦芽糖
 * time: 2017年03月12日15:44:18
 */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    StatusBar,
    StyleSheet,
    Platform
} from 'react-native'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import Icon from 'react-native-vector-icons/Ionicons'

import Bookshelves from './home/bookshelves'
import Discover from './home/discover'
import Community from './home/community'
import Mine from './home/mine'
import TabBar from '../weight/TabBar'
import Search from './search'
import config from '../common/config'

var tabIcons = ['ios-book-outline', 'ios-compass-outline', 'ios-chatboxes-outline', 'ios-contact-outline']
var tabNames = ["书架", "发现", "社区", "我的"]

export default class Home extends Component {
  render() {
    return (
      <View style = {styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLeftText}>间阅</Text>
          <Icon 
            name='ios-search'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._search.bind(this)}/>
          <Icon 
            name='md-add'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._other.bind(this)}/>
        </View>
        <ScrollableTabView
          scrollWithoutAnimation={true}
          tabBarPosition={'bottom'}
          renderTabBar={() => <TabBar tabIcons={tabIcons} tabNames={tabNames}/>}>
          <Bookshelves tabLabel="书架" navigator={this.props.navigator} />
          <Discover tabLabel='发现' navigator={this.props.navigator} />
          <Community tabLabel='社区' navigator={this.props.navigator} />
          <Mine tabLabel='我的' navigator={this.props.navigator} />
        </ScrollableTabView>
      </View>
    )
  }

  /**
   * 跳转到搜索页面
   */
  _search() {
    this.props.navigator.push({
        name: 'search',
        component: Search
      })
  }

  /**
   * 显示其他menu
   */
  _other() {

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
  headerLeftText: {
    flex: 1,
    color: config.css.fontColor.title,
    marginLeft: 14,
    fontSize: config.css.fontSize.appTitle,
    fontWeight: 'bold'
  },
  headerIcon: {
    marginLeft: 14,
    marginRight: 14
  }
})