/*
 * description: the main activity of app
 * author: 麦芽糖
 * time: 2017年03月12日15:10:19
 */

import React, { Component } from 'react'
import {
  View,
  BackAndroid,
  AsyncStorage,
  StatusBar
} from 'react-native'
import {Navigator} from 'react-native-deprecated-custom-components';
import Storage from 'react-native-storage'
import Realm from 'realm'

import Splash from './components/splash'
import config from './common/config'
import schemaArray from './common/modelSchema'

var storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  // 你可以在构造函数这里就写好sync的方法
  // 或是写到另一个文件里，这里require引入
  // 或是在任何时候，直接对storage.sync进行赋值修改
  // sync: require('./utils/syncStorage')
})

global.storage = storage
global.realm = new Realm({schema: schemaArray})

export default class App extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor={config.css.color.appMainColor}
          translucent={true}
          showHideTransition={'slide'}
          animated={true}/>
        <Navigator 
          style={{flex: 1}}
          initialRoute={{name: 'splash', component: Splash}}
          renderScene = {
            (rount, navigator) => {
              _navigator = navigator
              let Component = rount.component
              return  <Component {...rount.params} navigator={navigator}/>
            }
          }
          configureScene = {(rount) => Navigator.SceneConfigs.PushFromRight}
        />
      </View>
    )
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  if(_navigator && _navigator.getCurrentRoutes().length > 1){
    _navigator.pop()
    return true
  }
  return false
})
