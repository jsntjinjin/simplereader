/*
 * description: 分类详情
 * author: 麦芽糖
 * time: 2017年04月10日22:36:39
 */

/*
 * description: 书单详情页面
 * author: 麦芽糖
 * time: 2017年04月08日10:47:38
 */

import React, { Component } from 'react'
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ListView,
  Modal
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import TabBarOnlyText from '../../weight/TabBarOnlyText'
import BookDetail from '../bookDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import request from '../../utils/httpUtil'
import Toast from '../../weight/toast'
import CategoryDetailTab from './categoryDetailTab'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabNames = ["新书", "热门", "口碑", "完结"]

export default class CategoryDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categoryList: [],
      minor: '',
      toShow: false
    }
  }

  componentDidMount() {
    const categoryList = this._stringArrayToObjectArray(this.props.categoryListSelected)
    this.setState({categoryList: categoryList})
  }

  _back() {
    this.props.navigator.pop()
  }

  _chooseMinor(obj) {
    if (obj.name === 'major') {
      this.setState({minor: '', toShow: false})
    } else {
      this.setState({minor: obj.value, toShow: false})
    }
  }

  _stringArrayToObjectArray(temp) {
    let array = new Array()
    let o1 = new Object()
    o1.name = 'major'
    o1.value = temp.major
    array.push(o1)
    for (let i = 0; i < temp.mins.length; i++) {
      let element = temp.mins[i];
      let o = new Object()
      o.name = 'mins'
      o.value = element
      array.push(o)
    }
    return array
  }
  
  _closeModal() {
    this.setState({toShow: false})
  }

  _showChooseBox() {
    this.setState({toShow: true})
  }

  renderList(array) {
    var items = []
    if (array) {
      for (var i = 0; i < array.length; i++) {
        let element = array[i]
        items.push(
          <TouchableOpacity 
            key={i}
            activeOpacity={0.5}
            onPress={() => this._chooseMinor(element)}>
            <Text style={styles.chooseItem}>{element.value}</Text>
          </TouchableOpacity>
        )
      }
    }
    return items
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>{this.state.minor === '' ? this.props.major: this.state.minor}</Text>
          <Icon 
            name='ios-stats-outline'
            style= {styles.headerIcon}
            size={25}
            onPress={this._showChooseBox.bind(this)}
            color={config.css.color.appBlack}/>
        </View>
        <ScrollableTabView
          scrollWithoutAnimation={true}
          tabBarPosition={'top'}
          renderTabBar={() => <TabBarOnlyText tabNames={tabNames}/>}>
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='new' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel="新书" 
            navigator={this.props.navigator} />
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='hot' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel='热门' 
            navigator={this.props.navigator} />
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='reputation' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel='口碑' 
            navigator={this.props.navigator} />
          <CategoryDetailTab 
            gender={this.props.gender} 
            type='over' 
            major={this.props.major} 
            minor={this.state.minor} 
            tabLabel='完结' 
            navigator={this.props.navigator} />
        </ScrollableTabView>
        <Modal
          visible={this.state.toShow}
          animationType = {'none'}
          transparent = {true}>
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => this._closeModal()}>
            <View style={styles.listView} >
              {this.renderList(this.state.categoryList).map((item, i) => {
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
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground
  },
  header: {
    height: config.css.headerHeight,
    paddingTop: config.css.statusBarHeight,
    backgroundColor: config.css.color.appMainColor,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcon: {
    marginLeft: 14,
    marginRight: 14
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.appTitle
  },
  modal: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  listView: {
    backgroundColor: config.css.color.white,
    marginTop: config.css.headerHeight + 30, 
    marginLeft: Dimen.window.width / 2 + 60
  },
  chooseItem: {
    width: Dimen.window.width / 2 - 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: config.css.color.appBackground,
    borderColor: config.css.color.line,
    borderWidth: 1
  },
})