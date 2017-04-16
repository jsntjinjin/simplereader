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
  },
  bookType: {
    'qt': '其他',
    'xhqh': '玄幻奇幻',
    'wxxx': '武侠仙侠',
    'dsyn': '都市异能',
    'lsjs': '历史军事',
    'yxjj': '游戏竞技',
    'khly': '科幻灵异',
    'cyjk': '穿越架空',
    'hmzc': '豪门总裁',
    'xdyq': '现代言情',
    'gdyq': '古代言情',
    'hxyq': '幻想言情',
    'dmtr': '耽美同人',
  },
  bookTypeKey: ['全部类型','玄幻奇幻','武侠仙侠','都市异能','历史军事','游戏竞技','科幻灵异','穿越架空','豪门总裁','现代言情','古代言情','幻想言情','耽美同人'],
  bookTypeValue: ['all', 'xhqh', 'wxxx', 'dsyn', 'lsjs', 'yxjj', 'khly', 'cyjk', 'hmzc', 'xdyq', 'gdyq', 'hxyq', 'dmtr', 
  ]
}