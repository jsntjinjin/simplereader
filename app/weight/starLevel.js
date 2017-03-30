/*
 * description: 星级评定控件
 * author: 麦芽糖
 * time: 2017年03月19日23:36:45
 */

import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import config from '../common/config'

export default class StarLevel extends Component {

  renderRatingMap(rating) {
    var items = []
    for (var i = 0; i < 5; i++) {
      items.push(
        i < rating ?
        <View key={i}>
          <Icon 
            name='ios-star'
            size={15}
            color={config.css.color.appMainColor}/>
        </View>
        : 
        <View key={i}>
          <Icon 
            name='ios-star-outline'
            size={15}
            color={config.css.color.appMainColor}/>
        </View>
      )
    }
    return items
  }
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        {this.renderRatingMap(this.props.rating).map((item, i) => {
          return item
        })}
      </View>
    )
  }
}