/*
 * description: 我的其他设置
 * author: 麦芽糖
 * time: 2017年04月21日15:40:48
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import CommonItemForTab from '../../weight/commonItemForTab'
import MyBookList from '../mine/myBookList'
import MyFattenList from '../mine/myFattenList'
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

  _goToFatten() {
    this.props.navigator.push({
      name: 'myFattenList',
      component: MyFattenList
    })
  }

  render() {
    return (
      <View style={styles.body}>
        <CommonItemForTab title={'我的书单'} image={require('../../imgs/icon_booklist.png')} clickItem={() => this._goToMyBookList()}/>
        <View style={styles.line}/>
        <CommonItemForTab title={'书籍养肥区'} image={require('../../imgs/icon_fatten.png')} clickItem={() => this._goToFatten()}/>
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
