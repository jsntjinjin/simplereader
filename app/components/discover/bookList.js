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
  ListView
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import TabBarOnlyText from '../../weight/TabBarOnlyText'
import ChartsDetail from './chartsDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import {bookListData} from '../../actions/bookListAction'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabNames = ['本周最热', '最新发布', '最多收藏']

class BookList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      gender: 'male',
      tag: '',
      style: 0
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(bookListData(this._setBookListParams(style, 0, this.state.tag, this.state.gender), true, []))
  }

  _setBookListParams(style, start, tag, gender) {
    var limit = 20
    switch (style) {
      case 0: // 本周最热
        return {duration: 'last-seven-days', sort: 'collectorCount', start: start, tag: tag, gender: gender, limit: limit}
      case 1: // 最新发布
        return {duration: 'all', sort: 'created', start: start, tag: tag, gender: gender, limit: limit}
      case 2: // 最多收藏
        return {duration: 'all', sort: 'collectorCount', start: start, tag: tag, gender: gender, limit: limit}
    }
  }

  _back() {
    this.props.navigator.pop()
  }

  _clickStarts() {
    this.setState({haha: 'abc'})
  }

  _goToBookListDetail(rowData) {
    this.props.navigator.push({
      name: 'chartsDetail',
      component: ChartsDetail,
      params: {
        chartsItem: rowData
      }
    })
  }

  _showMoreItem() {
    const {bookList, dispatch} = this.props
    if(bookList.bookLists.length === 0 || bookList.isLoading || bookList.isLoadingMore || bookList.bookLists.length === bookList.total){
      return
    }
    dispatch(bookListData(this._setBookListParams(style, bookList.bookLists.length, this.state.tag, this.state.gender), false, bookList.bookLists))
  }

  renderBookList(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToBookListDetail(rowData)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.cover 
              ? {uri: (api.IMG_BASE_URL + rowData.cover)} 
              : require('../../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <Text style={styles.itemDesc}>{rowData.author}</Text>
            <Text style={styles.itemDesc} numberOfLines={1}>{rowData.desc}</Text>
            <Text style={styles.itemDesc}>{'共' + rowData.bookCount + '本书 | ' + rowData.collectorCount + '人收藏'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    const {bookList} = this.props
    if (bookList.bookLists.length === 0 || bookList.isLoading) {
      return null
    }
    if (bookList.bookLists.length < bookList.total) {
      return (
        <Text style={styles.bookListFooter}>正在加载更多~~~</Text>
      )
    } else {
      return (
        <Text style={styles.bookListFooter}>没有更多书单了~~~</Text>
      )
    }
  }

  render() {
    const {bookList} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>主题书单</Text>
          <Icon 
            name='ios-stats-outline'
            style= {styles.headerIcon}
            size={25}
            onPress={this._clickStarts.bind(this)}
            color={config.css.color.appBlack}/>
        </View>
        {bookList.isLoading ? 
            <Text style={styles.body}>正在加载中~~~</Text>
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(bookList.bookLists)}
              onEndReached={this._showMoreItem.bind(this)}
              onEndReachedThreshold={30}
              renderRow={this.renderBookList.bind(this)}
              renderFooter={this.renderFooter.bind(this)}/>
        }
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
  body: {
    flex: 1
  },
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
  },
  item: {
    flexDirection: 'row',
    height: 100,
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    alignSelf: 'center',
    width: 45,
    height: 60
  },
  itemBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  itemTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    marginBottom: 3
  },
  itemDesc: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginTop: 3,
    marginRight: 14
  },
  bookListFooter: {
    height: 30,
    width: Dimen.window.width,
    textAlign: 'center'
  }
})

function mapStateToProps(store) {
  const { bookList } = store
  return {
    bookList
  }
}

export default connect(mapStateToProps)(BookList)