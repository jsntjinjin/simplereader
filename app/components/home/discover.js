/*
 * description: 发现tab
 * author: 麦芽糖
 * time: 2017年04月05日14:01:37
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import CommonItemForTab from '../../weight/commonItemForTab'
import ReadPlatform from '../readPlatform'
import Charts from '../discover/charts'
import BookList from '../discover/bookList'
import CategoryList from '../discover/categoryList'
import config from '../../common/config'

export default class Discover extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  /**
   * 跳转排行榜
   */
  _goToCharts() {
    this.props.navigator.push({
      name: 'charts',
      component: Charts
    })
  }

  /**
   * 跳转主题书单
   */
  _goToThemeBookList() {
    this.props.navigator.push({
      name: 'bookList',
      component: BookList
    })
  }

  /**
   * 跳转分类
   */
  _goToClassify() {
    this.props.navigator.push({
      name: 'categoryList',
      component: CategoryList
    })
  }

  render() {
    return (
      <View style={styles.body}>
        <CommonItemForTab title={'排行榜'} image={require('../../imgs/splash.jpg')} clickItem={() => this._goToCharts()}/>
        <View style={styles.line}/>
        <CommonItemForTab title={'主题书单'} image={require('../../imgs/splash.jpg')} clickItem={() => this._goToThemeBookList()}/>
        <View style={styles.line}/>
        <CommonItemForTab title={'分类'} image={require('../../imgs/splash.jpg')} clickItem={() => this._goToClassify()}/>
        <View style={styles.line}/>
        <CommonItemForTab title={'有声小说'} image={require('../../imgs/splash.jpg')}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  line: {
    height: 1, 
    backgroundColor: config.css.color.line, 
  },
})