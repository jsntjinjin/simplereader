/*
 * description: 标签书单
 * author: 麦芽糖
 * time: 2017年04月19日09:33:03
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
  InteractionManager
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import request from '../../utils/httpUtil'
import BookDetail from '../bookDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import Loading from '../../weight/loading'
import ToolBar from '../../weight/toolBar'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class AuthorBookList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      bookList: []
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=>{
      this._getBookListDetail({author: this.props.author})
    })
  }

  _getBookListDetail(params) {
    this.setState({isLoading: true})
    request.get(api.BOOK_AUTHOR_BOOK_LIST, params,
      (data) => {data.ok ? this.setState({isLoading: false, bookList: data.books}) : null},
      (error) => {this.setState({isLoading: false})})
  }

  _back() {
    this.props.navigator.pop()
  }

  /**
   * 跳转书的介绍页面
   * @param {string} id 书的信息
   */
  _goToBookDetail(id) {
    this.props.navigator.push({
      name: 'bookDetail',
      component: BookDetail,
      params: {
        bookId: id
      }
    })
  }

  renderBookList(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToBookDetail(rowData._id)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.cover 
              ? {uri: (api.IMG_BASE_URL + rowData.cover)} 
              : require('../../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <Text style={styles.itemDesc}>{rowData.author + ' | ' + rowData.majorCate}</Text>
            <Text style={styles.itemDesc} numberOfLines={1}>{rowData.shortIntro}</Text>
            <Text style={styles.itemDesc}>{rowData.latelyFollower + '在追 | ' + rowData.retentionRatio + '%人留存 | ' + rowData.author + '著'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolBar 
          leftClick={this._back.bind(this)}
          title={this.props.author}/>
        {this.state.isLoading ? 
            <Loading />
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(this.state.bookList)}
              renderRow={this.renderBookList.bind(this)}/>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground,
    alignItems: 'stretch'
  },
  body: {
    flex: 1
  },
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
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
})

