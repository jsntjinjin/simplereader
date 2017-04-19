/*
 * description: 我的收藏书单页面
 * author: 麦芽糖
 * time: 2017年04月10日10:47:58
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

import api from '../../common/api'
import BookDetail from '../bookDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import {dateFormat} from '../../utils/formatUtil'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class MyFattenList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      myBookList: []
    }
  }

  componentDidMount() {
    this._getMyBookList()
  }

  _back() {
    this.props.navigator.pop()
  }

  _getMyBookList() {
    var bookList = realm.objects('HistoryBook').filtered('isToShow = 2').sorted('sortNum', true)
    this.setState({myBookList: bookList})
  }

  _readBook(bookId) {
    this.props.navigator.push({
      name: 'bookDetail',
        component: BookDetail,
        params: {
          bookId: bookId
        }
    })
  }

  renderBookList(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._readBook(rowData.bookId)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.bookUrl 
              ? {uri: (api.IMG_BASE_URL + rowData.bookUrl)} 
              : require('../../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.bookName}</Text>
            <Text style={styles.itemDesc}>{
              dateFormat(rowData.lastChapterTime) + ' : ' + rowData.lastChapterTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    console.log('myBookList', this.state.myBookList)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>书籍养肥区</Text>
        </View>
        {this.state.myBookList ?
            <ListView
              style={styles.body}
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(this.state.myBookList)}
              renderRow={this.renderBookList.bind(this)}/>
          : 
            <Text style={styles.body}>暂无数据</Text>
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
  item: {
    flexDirection: 'row',
    height: 80,
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    alignSelf: 'center',
    width: 40,
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
    marginTop: 3
  }
})