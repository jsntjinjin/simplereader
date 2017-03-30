/*
 * description: 启动页
 * author: 麦芽糖
 * time: 2017年03月12日15:44:46
 */


import React, { Component } from 'react';
import {
    View,
    Image,
    StatusBar,
    StyleSheet
} from 'react-native';

import Dimen from '../utils/dimensionsUtil'
import Home from './home'

export default class Splash extends Component {

  // 倒计时2秒后进入首页
  componentDidMount() {
    setTimeout(() => {
      this.props.navigator.replace({
        name: 'home',
        component: Home
      })
    }, 2000);
  }

  render() {
    return (
      <View style = {styles.root}>
        <StatusBar hidden = {true} />
        <Image 
          style = {styles.image} 
          source = {require('../imgs/splash.jpg')} 
          resizeMode = {'cover'}/>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  root: {
    flex: 1
  },
  image: {
    width: Dimen.window.width,
    height: Dimen.window.height
  }
})
