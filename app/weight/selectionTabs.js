/*
 * description: 选择组件
 * author: 麦芽糖
 * time: 2017年04月17日11:13:50
 */

import React, { Component } from 'react'
import {
  View,
  Text,
  ListView,
  TouchableOpacity,
  StyleSheet,
  Modal
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import config from '../common/config'
import Dimen from '../utils/dimensionsUtil'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class SelectionTabs extends Component {

  static propTypes = {
    selectItem: React.PropTypes.func,
    tabArray: React.PropTypes.array
  }

  constructor(props) {
    super(props)
    this.state = {
      selection: [],
      showList: false,
      key: 0
    }
  }

  componentDidMount() {
    let select = []
    this.props.tabArray.forEach(function(element) {
      select.push(element[0])
    }, this);
    this.setState({selection: select})
  }
  
  _onClick() {
    this.props.clickItem()
  }

  _change(key) {
    let temp = this.state.selection
    temp[this.state.key] = this.props.tabArray[this.state.key][key]
    this.setState({selection: temp, showList: false})
    this.props.selectItem(this.state.selection)
  }

  _closeModal() {
    this.setState({showList: false})
  }

  renderList(array) {
    var items = []
    if (array) {
      for (var i = 0; i < array.length; i++) {
        items.push(
          <TouchableOpacity 
            key={i}
            activeOpacity={0.5}
            onPress={this._change.bind(this, i)}
            style={styles.autoItem}>
            <Text>{array[i].name}</Text>
          </TouchableOpacity>
        )
      }
    }
    return items
  }

  _selectItem(key) {
    this.setState({key: key, showList: true})
  }

  renderItem(selection) {
    var items = []
    if (selection) {
      for (var i = 0; i < selection.length; i++) {
        items.push(
          <TouchableOpacity 
            key={i}
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: Dimen.window.width / selection.length}}
            onPress={this._selectItem.bind(this, i)}>
            <Text style={styles.title}>{selection[i].name}</Text>
            <Icon
              name='ios-arrow-down-outline'
              style={styles.rightIcon}
              size={20}
              color={config.css.color.appBlack} />
          </TouchableOpacity>
        )
      }
    }
    return items
  }

  render() {
    return (
      <View style={styles.body}>
        {this.renderItem(this.state.selection).map((item, i) => {
          return item
        })}
        <Modal
          visible={this.state.showList}
          animationType = {'none'}
          transparent = {true}>
          <TouchableOpacity 
            style={styles.modal}
            activeOpacity={1}
            onPress={() => this._closeModal()}>
            <View style={styles.listView}>
              {this.renderList(this.props.tabArray[this.state.key]).map((item, i) => {
                return item
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    width: Dimen.window.width,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: config.css.color.appMainColor
  },
  title: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.title,
  },
  rightIcon: {
    marginLeft: 20
  },
  modal: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    marginTop: config.css.headerHeight + 30,
  },
  listView: {
    backgroundColor: config.css.color.white,
  },
  autoItem: {
    height: 30, 
    justifyContent: 'center',
    alignItems: 'center'
  }
})