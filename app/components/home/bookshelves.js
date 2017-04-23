/*
 * description: 书架tab
 * author: 麦芽糖
 * time: 2017年04月04日17:08:01
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  ListView,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Text,
  Modal
} from 'react-native'

import ReadPlatform from '../readPlatform'
import BookDetail from '../bookDetail'
import config from '../../common/config'
import api from '../../common/api'
import Dimen from '../../utils/dimensionsUtil'
import {dateFormat} from '../../utils/formatUtil'
import Toast from '../../weight/toast'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class Bookshelves extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bookshelves: [],
      toShow: false,
      focusBook: null
    }
  }

  componentDidMount() {
    this._getBookshelves()
  }

  componentWillReceiveProps() {
    this._getBookshelves()
  }

  _getBookshelves() {
    this.setState({
      bookshelves: realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true)
    })
  }

  _readBook(bookId) {
    this.props.navigator.push({
      name: 'readPlatform',
        component: ReadPlatform,
        params: {
          bookId: bookId
        }
    })
  }

  _showModal(book) {
    this.setState({
      toShow: true,
      focusBook: book
    })
  }

  _closeModal() {
    this.setState({toShow: false})
  }

  /**
   * modal置顶
   */
  _toTop() {
    let bookDetail = this.state.focusBook
    var books = realm.objects('HistoryBook').sorted('sortNum')
    realm.write(() => {
      realm.create('HistoryBook', {
        bookId: bookDetail.bookId, 
        sortNum: books && books.length > 0 ? books[books.length - 1].sortNum + 1 : 0
      }, true)
    })
    this.setState({
      bookshelves: realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true),
      toShow: false
    })
  }

  /**
   * modal书籍详情
   */
  _toBookDetail() {
    let bookDetail = this.state.focusBook
    this.props.navigator.push({
      name: 'bookDetail',
      component: BookDetail,
      params: {
        bookId: bookDetail.bookId
      }
    })
    this.setState({toShow: false})
  }

  /**
   * modal移入养肥区
   */
  _toBookFatten() {
    let bookDetail = this.state.focusBook
    var books = realm.objects('HistoryBook').sorted('sortNum')
    realm.write(() => {
      realm.create('HistoryBook', {
        bookId: bookDetail.bookId, 
        sortNum: books && books.length > 0 ? books[books.length - 1].sortNum + 1 : 0,
        isToShow: 2
      }, true)
    })
    this.setState({
      bookshelves: realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true),
      toShow: false
    })
  }

  /**
   * modal缓存全本
   */
  _toSaveBook() {
    Toast.toastLong('拼命开发中~~~')
    this.setState({toShow: false})
  }

  /**
   * modal删除
   */
  _toDelete() {
    let bookDetail = this.state.focusBook
    realm.write(() => {
      realm.create('HistoryBook', {bookId: bookDetail.bookId, isToShow: 0}, true)
    })
    this.setState({
      bookshelves: realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true),
      toShow: false,
      focusBook: null
    })
  }

  renderBookshelves(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onLongPress={() => this._showModal(rowData)}
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
    return (
      <View style={{flex: 1}}>
        {this.state.bookshelves && this.state.bookshelves.length > 0 ? 
          <ListView
            enableEmptySections={true}
            dataSource={ds.cloneWithRows(this.state.bookshelves)}
            renderRow={this.renderBookshelves.bind(this)}/>
          : 
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text >您还没有收藏过任何书籍哦~~</Text>
          </View>
        }
        {this.state.focusBook ?
            <Modal
              visible={this.state.toShow}
              animationType = {'none'}
              transparent = {true}>
              <TouchableOpacity 
                style={styles.modal} 
                activeOpacity={1}
                onPress={() => this._closeModal()}>
                <View style={styles.innerView} >
                  <Text style={styles.modalTitle}>{this.state.focusBook.bookName}</Text>
                  <Text style={styles.modalBody} onPress={this._toTop.bind(this)}>置顶</Text>
                  <Text style={styles.modalBody} onPress={this._toBookDetail.bind(this)}>书籍详情</Text>
                  <Text style={styles.modalBody} onPress={this._toBookFatten.bind(this)}>移入养肥区</Text>
                  <Text style={styles.modalBody} onPress={this._toSaveBook.bind(this)}>缓存全本</Text>
                  <Text style={styles.modalBody} onPress={this._toDelete.bind(this)}>删除</Text>
                </View>
              </TouchableOpacity>
            </Modal>
          :
            null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center'
  },
  innerView: {
    backgroundColor: config.css.color.white,
    borderWidth: 1,
    borderColor: config.css.color.line,
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 10
  },
  modalTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  modalBody: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: Dimen.window.width - 80,
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.title,
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