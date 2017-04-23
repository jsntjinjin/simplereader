/*
 * description: loading
 * author: 麦芽糖
 * time: 2017年04月23日13:04:37
 */


import React, { Component } from 'react'
import {
  View,
  Text
} from 'react-native'
import config from '../common/config'
import CommonText from './commonText'

export default class Loading extends Component {

  render() {
    return (
      <CommonText text='正在加载中~~~'/>
    )
  }
}
