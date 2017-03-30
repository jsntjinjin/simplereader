/*
 * description: the config of app
 * author: 麦芽糖
 * time: 2017年03月12日19:45:10
 */

'use strict'

import {
    Platform
} from 'react-native'

const STATUS_BAR_HEIGHT = (Platform.OS === 'ios' ? 20 : 24)
const header_height = (Platform.OS === 'ios' ? 70 : 74)

module.exports = {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  css: {
    statusBarHeight: STATUS_BAR_HEIGHT,
    headerHeight: header_height,
    fontSize: {
      appTitle: 18,
      title: 16,
      desc: 12
    },
    fontColor: {
      appMainColor: '#ee735c',
      title: '#333333',
      desc: '#999999',
      white: '#ffffff',
      author: '#cc9900'
    },
    color: {
      appBackground: '#ffffff',
      appMainColor: '#ee735c',
      appBlack: '#333333',
      line: '#e6e6e6',
      buttonColor: '#90C5F0',
      white: '#ffffff',
      black: '#000000'
    },
    boxColor: ['#90C5F0', '#91CED5', '#F88F55', '#C0AFD0', '#E78F8F', '#67CCB7', '#F6BC7E']
  }
}