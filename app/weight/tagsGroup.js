/*
 * description: 标签控件
 * author: 麦芽糖
 * time: 2017年03月19日23:50:59
 */

import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import config from '../common/config'

export default class TagsGroup extends Component {

  static propTypes = {
    checkTag: React.PropTypes.func
  }

  onClick(tag) {
    if (this.props.checkTag) {
      console.log('当前点击的tag', tag)
      this.props.checkTag(tag)
    }
  }

  renderTags(array) {
    var texts = []
    if (array) {
      for (var i = 0; i < array.length; i++) {
        boxColorIndex = i % 7
        var element = array[i];
        texts.push(
          <TouchableOpacity 
            activeOpacity={0.5}
            key={i}
            style={{
              alignSelf: 'center',
              margin: 5,
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 2,
              paddingBottom: 2,
              backgroundColor: config.css.boxColor[boxColorIndex]
            }}
            onPress={this.onClick.bind(this, element)}>
            <Text style={{color: '#ffffff',}}>
              {element}
            </Text>
          </TouchableOpacity>
        )
      }
    }
    return texts
  }

  render() {
    return (
      <View 
        style={{
          marginLeft: 14,
          marginRight: 14,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}>
        {this.renderTags(this.props.tags).map((item, i) => {
          return item
        })}
      </View>
    )
  }
}