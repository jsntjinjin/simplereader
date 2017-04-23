/*
 * description: loading
 * author: 麦芽糖
 * time: 2017年04月23日13:04:37
 */


import React, { Component } from 'react'
import {
  Text,
  StyleSheet
} from 'react-native'
import config from '../common/config'
import Dimen from '../utils/dimensionsUtil'
import CommonText from './commonText'

export default class LoadingMore extends Component {

  static propTypes = {
    hasMore: React.PropTypes.bool
  }

  render() {
    return (
      <Text style={styles.bookListFooter}>{this.props.hasMore ? '正在加载更多~~~' : '没有更多了'}</Text>
    )
  }
}

const styles = StyleSheet.create({
  bookListFooter: {
    height: 30,
    width: Dimen.window.width,
    textAlign: 'center'
  }
})
