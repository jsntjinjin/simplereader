/*
 * description: 主题书单页面
 * author: 麦芽糖
 * time: 2017年04月05日16:10:56
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
  Modal,
  InteractionManager,
  Platform
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import TabBarOnlyText from '../../weight/TabBarOnlyText'
import TagsGroup from '../../weight/tagsGroup'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import BookListTab from './bookListTab'
import request from '../../utils/httpUtil'
import ToolBar from '../../weight/toolBar'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabNames = ['本周最热', '最新发布', '最多收藏']

export default class BookList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      gender: 'male',
      tag: '',
      bookListTags: null,
      toShow: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._getBookListTag()
    })
  }

  _back() {
    this.props.navigator.pop()
  }

  _getBookListTag() {
    request.get(api.DISCOVER_BOOK_LIST_TAG, null,
      (data) => {data.ok ? this.setState({bookListTags: data.data}) : null})
  }

  _showTags() {
    this.setState({toShow: true})
  }

  _changeTag(tag) {
    this.setState({tag: tag, toShow: false})
  }

  _closeModal() {
    this.setState({toShow: false})
  }

  renderList(array) {
    var items = []
    if (array) {
      for (var i = 0; i < array.length; i++) {
        let element = array[i]
        items.push(
          <View key={i}>
            <Text style={styles.itemTitle}>{element.name}</Text>
            <TagsGroup tags={element.tags} checkTag={(tag) => this._changeTag(tag)}/>
          </View>
        )
      }
    }
    return items
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolBar 
          leftClick={this._back.bind(this)}
          title='主题书单'
          rightIcon='ios-stats-outline'
          rightClick={this._showTags.bind(this)}/>
        <ScrollableTabView
          scrollWithoutAnimation={true}
          tabBarPosition={'top'}
          renderTabBar={() => <TabBarOnlyText tabNames={tabNames}/>}>
          <BookListTab 
            duration='last-seven-days'
            sort='collectorCount'
            gender={this.state.gender}
            tag={this.state.tag}
            tabLabel="本周最热" 
            navigator={this.props.navigator} />
          <BookListTab 
            duration='all'
            sort='created'
            gender={this.state.gender}
            tag={this.state.tag}
            tabLabel='最新发布' 
            navigator={this.props.navigator} />
          <BookListTab 
            duration='all'
            sort='collectorCount'
            gender={this.state.gender}
            tag={this.state.tag}
            tabLabel='最多收藏' 
            navigator={this.props.navigator} />
        </ScrollableTabView>
        <Modal
          visible={this.state.toShow}
          animationType = {'slide'}
          transparent = {true}>
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => this._closeModal()}>
            <View style={styles.listView} >
              {this.renderList(this.state.bookListTags).map((item, i) => {
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
  modal: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: config.css.headerHeight - (Platform.OS === 'ios' ? 0 : 20)
  },
  listView: {
    backgroundColor: config.css.color.white,
    paddingBottom: 20
  },
  itemTitle: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 14,
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.title
  }
})
