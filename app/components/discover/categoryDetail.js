/*
 * description: 分类详情
 * author: 麦芽糖
 * time: 2017年04月10日22:36:39
 */

/*
 * description: 书单详情页面
 * author: 麦芽糖
 * time: 2017年04月08日10:47:38
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
import BookDetail from '../bookDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import request from '../../utils/httpUtil'
import Toast from '../../weight/toast'
import CategoryDetailTab from './categoryDetailTab'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabNames = ["新书", "热门", "口碑", "完结"]

export default class CategoryDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categoryList: null,
      minor: ''
    }
  }

  componentDidMount() {
    const categoryList = this.props.categoryListSelected
    this.setState({categoryList: categoryList})
  }

  _back() {
    this.props.navigator.pop()
  }

  _chooseMinor() {
    this.setState({minor: '东方玄幻'})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>{this.state.minor === '' ? this.props.major: this.state.minor}</Text>
          <Icon 
            name='ios-stats-outline'
            style= {styles.headerIcon}
            size={25}
            onPress={this._chooseMinor.bind(this)}
            color={config.css.color.appBlack}/>
        </View>
        <ScrollableTabView
          scrollWithoutAnimation={true}
          tabBarPosition={'top'}
          renderTabBar={() => <TabBarOnlyText tabNames={tabNames}/>}>
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='new' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel="新书" 
            navigator={this.props.navigator} />
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='hot' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel='热门' 
            navigator={this.props.navigator} />
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='reputation' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel='口碑' 
            navigator={this.props.navigator} />
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='over' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel='完结' 
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