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
import MyBookList from '../discover/myBookList'
import config from '../../common/config'

export default class Mine extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  /**
   * 跳转我的书单
   */
  _goToMyBookList() {
    this.props.navigator.push({
      name: 'myBookList',
      component: MyBookList
    })
  }

  render() {
    return (
      <View style={styles.body}>
        <CommonItemForTab title={'我的书单'} image={require('../../imgs/splash.jpg')} clickItem={() => this._goToMyBookList()}/>
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