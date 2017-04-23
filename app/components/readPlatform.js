/*
 * description: 阅读器
 * author: 麦芽糖
 * time: 2017年03月20日15:50:28
 */

import React, { Component } from 'react'
import {
  View,
  StatusBar,
  Image,
  Text,
  TextInput,
  StyleSheet,
  ListView,
  TouchableOpacity,
  ScrollView,
  Modal,
  InteractionManager
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'

import BookDetail from './bookDetail'
import BookCommunity from './book/bookCommunity'
import request from '../utils/httpUtil'
import Dimen from '../utils/dimensionsUtil'
import api from '../common/api'
import config from '../common/config'
import {bookChapter, chapterDetailFromNet}from '../actions/readPlatformAction'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class ReadPlatform extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bookName: '',
      showControlStation: false,
      showSaveModal: false,
      showListModal: false,
      chapterPage: 1
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    let bookId = this.props.bookId
    let book = realm.objectForPrimaryKey('HistoryBook', bookId)
    if (this.props.bookDetail) {
      this.setState({bookName: this.props.bookDetail.title})
    } else {
      this.setState({bookName: book.bookName})
    }
    InteractionManager.runAfterInteractions(()=>{
      dispatch(bookChapter(bookId, book ? book.historyChapterNum : 0))
      this._updateHistoryBookChapter(bookId, book ? book.historyChapterNum : 0)
    })
  }

  _back() {
    let bookId = this.props.bookId
    let book = realm.objectForPrimaryKey('HistoryBook', bookId)
    if (book && book.isToShow !== 0) {
      this._toPop()
    } else {
      this.setState({showSaveModal: true})
    }
  }

  _closeModal() {
    this.setState({showSaveModal: false})
  }

  _toPop() {
    this.props.navigator.pop()
  }

  _toSaveAndPop() {
    const {readPlatform} = this.props
    let bookId = this.props.bookId
    let book = realm.objectForPrimaryKey('HistoryBook', bookId)
    this._closeModal()
    if (!book || book.isToShow === 0) {
      this.saveBookToRealm(this.props.bookDetail, readPlatform.chapterNum)
    }
    this._toPop()
  }

  /**
   * 向数据库中保存当前书籍的记录
   */
  saveBookToRealm(bookDetail, chapterNum) {
    let bookId = this.props.bookId
    var books = realm.objects('HistoryBook').sorted('sortNum')
    let book = realm.objectForPrimaryKey('HistoryBook', bookId)
    realm.write(() => {
      if (book) {
        if (book.bookId == books[books.length - 1].bookId) {
          realm.create('HistoryBook', {bookId: book.bookId, isToShow: 1, historyChapterNum: chapterNum}, true)
        } else {
          var sortNum = books[books.length - 1].sortNum + 1
          realm.create('HistoryBook', {bookId: book.bookId, isToShow: 1, sortNum: books[books.length - 1].sortNum + 1, historyChapterNum: chapterNum}, true)
        }
      } else {
        realm.create('HistoryBook', {
          bookId: bookDetail._id,
          bookName: bookDetail.title,
          bookUrl: bookDetail.cover,
          lastChapterTitle: bookDetail.lastChapter,
          historyChapterNum: chapterNum,
          lastChapterTime: bookDetail.updated,
          saveTime: new Date(),
          sortNum: books && books.length > 0 ? books[books.length - 1].sortNum + 1 : 0,
          isToShow: 1
        });
      }
    })
  }

  /**
   * 进入书籍社区
   */
  _toBookCommunity() {
    this.props.navigator.push({
      name: 'bookCommunity',
      component: BookCommunity,
      params: {
        bookId: this.props.bookId,
        page: 0
      }
    })
  }

  /**
   * 进入书籍详情界面
   */
  _toBookDetail() {
    const {readPlatform} = this.props
    this.props.navigator.push({
      name: 'bookDetail',
      component: BookDetail,
      params: {
        bookId: '582c6357bfd78a18167e46f3'
      }
    })
  }

  _showListModal() {
    this.setState({showListModal: true, showControlStation: false})
  }

  _closeListModal() {
    this.setState({showListModal: false})
  }

  _clickListModalItem(rowID) {
    this._nowChapter(rowID)
    this._closeListModal()
  }

  _showControlStation(evt) {
    var pageX = evt.nativeEvent.pageX
    var pageY = evt.nativeEvent.pageY
    if (pageX > Dimen.window.width / 3 && pageX < Dimen.window.width * 2 / 3
          && pageY > Dimen.window.height / 3 && pageY < Dimen.window.height * 2 / 3) {
      this.setState({showControlStation: true})
    } else {
      this._scrollView.scrollTo({x: 0, y: Dimen.window.height * this.state.chapterPage, animated: false})
      this.setState({chapterPage: this.state.chapterPage + 1})
    }
  }

  _lastChapter(chapterNum) {
    const {dispatch, readPlatform} = this.props
    let url = readPlatform.bookChapter.chapters[chapterNum - 1].link
    dispatch(chapterDetailFromNet(url, chapterNum - 1))
    this._updateHistoryBookChapter(this.props.bookId, chapterNum - 1)
  }

  _nowChapter(chapterNum) {
    const {dispatch, readPlatform} = this.props
    let url = readPlatform.bookChapter ? readPlatform.bookChapter.chapters[chapterNum].link : null
    dispatch(chapterDetailFromNet(url, chapterNum))
    this._updateHistoryBookChapter(this.props.bookId, chapterNum)
  }

  _nextChapter(chapterNum) {
    const {dispatch, readPlatform} = this.props
    let url = readPlatform.bookChapter.chapters[chapterNum + 1].link
    dispatch(chapterDetailFromNet(url, chapterNum + 1))
    this._updateHistoryBookChapter(this.props.bookId, chapterNum + 1)
  }

  _updateHistoryBookChapter(bookId, chapterNum){
    var books = realm.objects('HistoryBook').sorted('sortNum')
    var book = realm.objectForPrimaryKey('HistoryBook', bookId)
    if (book) {
      realm.write(() => {
        if (book.bookId === books[books.length - 1].bookId) {
          realm.create('HistoryBook', {bookId: book.bookId, historyChapterNum: chapterNum}, true)
        } else {
          var sortNum = books[books.length - 1].sortNum + 1
          realm.create('HistoryBook', {bookId: book.bookId, sortNum: books[books.length - 1].sortNum + 1, historyChapterNum: chapterNum}, true)
        }
      })
    }
  }

  renderListModal(rowData, sectionID, rowID, highlightRow) {
    const {readPlatform} = this.props
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._clickListModalItem(parseInt(rowID))}>
        {
          readPlatform.chapterNum !== parseInt(rowID) ?
            <Text 
              numberOfLines={1}
              style={[styles.listModalText, {fontSize: config.css.fontSize.title, color: config.css.fontColor.title}]}>
              {(parseInt(rowID) + 1) + ' -- '+ rowData.title}
            </Text>
          :
            <Text 
              numberOfLines={1}
              style={[styles.listModalText, {fontSize: config.css.fontSize.title, color: config.css.fontColor.appMainColor}]}>
              {(parseInt(rowID) + 1) + ' -- '+ rowData.title}
            </Text>
        }
      </TouchableOpacity>
    )
  }

  render() {
    const {readPlatform} = this.props
    return (
      <View style={styles.container}>
        <StatusBar 
          hidden={!this.state.showControlStation} 
          translucent={true}
          showHideTransition={'slide'}
          barStyle={'light-content'}/>
        <Image source={require('../imgs/read_bg.jpg')} style={{width: Dimen.window.width, height: Dimen.window.height}}>
          {readPlatform.chapterDetail ?
            <ScrollView
              onContentSizeChange={() => {
                this._scrollView.scrollTo({x: 0, y: 0, animated: false})
                this.setState({chapterPage: 1})
              }}
              ref={(ref) => this._scrollView = ref}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.textTitle}>{readPlatform.bookChapter.chapters[readPlatform.chapterNum].title}</Text>
              <Text 
                onStartShouldSetResponder={() => true}
                onResponderRelease={(evt) => {this._showControlStation(evt)}}
                style={styles.textBody}>
                {readPlatform.chapterDetail.body}
              </Text>
              <View style={{height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                {readPlatform.chapterNum != 0 ?
                  <TouchableOpacity 
                    activeOpacity={0.5}
                    onPress={() => this._lastChapter(readPlatform.chapterNum)}
                    style={{flexDirection: 'row', alignItems: 'center', marginLeft: 14}}>
                    <Icon 
                      name='ios-arrow-back-outline'
                      size={15}
                      color={config.css.fontColor.desc}>
                    </Icon>
                    <Text style={{fontSize: config.css.fontSize.desc,marginLeft: 5}}>上一章</Text>
                  </TouchableOpacity>
                : 
                  <View></View>
                }
                <TouchableOpacity 
                  activeOpacity={0.5}
                  onPress={() => this._nextChapter(readPlatform.chapterNum)}
                  style={{flexDirection: 'row', alignItems: 'center', marginRight: 14}}>
                  <Text style={{fontSize: config.css.fontSize.desc,marginRight: 5}}>下一章</Text>
                  <Icon 
                    name='ios-arrow-forward-outline'
                    size={15}
                    color={config.css.fontColor.desc}>
                  </Icon>
                </TouchableOpacity>
              </View>
            </ScrollView>
          :
            <Text 
              style={{flex: 1, textAlign: 'center'}}
              onPress={() => this._nowChapter(readPlatform.chapterNum)}>
              网络错误,请点击重试
            </Text>
          }
        </Image>
        {this.state.showControlStation ?
          <View style={{position: 'absolute', width: Dimen.window.width, height: Dimen.window.height}}>
            <View style={[styles.control,{paddingTop: config.css.statusBarHeight}]}>
              <Icon 
                name='ios-arrow-back-outline'
                style= {{marginLeft: 14, flex: 1}}
                size={25}
                color={config.css.color.appBlack}
                onPress={this._back.bind(this)}/>
              <Text style={styles.controlHeaderTitle} onPress={this._toBookCommunity.bind(this)}>社区</Text>
              <Text style={styles.controlHeaderTitle} onPress={this._toBookDetail.bind(this)}>简介</Text>
            </View>
            <Text 
              onPress={() => {this.setState({showControlStation: false})}}
              style={{flex: 1}}>
            </Text>
            <View style={[styles.control,{height: 50}]}>
              <TouchableOpacity style={styles.controlFooterItem} onPress={this._back.bind(this)}>
                <Icon 
                  name='ios-settings'
                  style={styles.controlFooterIcon}
                  size={25}
                  color={config.css.color.appBlack}/>
                <Text style={styles.controlFooterTitle}>设置</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlFooterItem} onPress={this._back.bind(this)}>
                <Icon 
                  name='ios-cloud-download'
                  style={styles.controlFooterIcon}
                  size={25}
                  color={config.css.color.appBlack}/>
                <Text style={styles.controlFooterTitle}>缓存</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlFooterItem} onPress={this._back.bind(this)}>
                <Icon 
                  name='ios-bookmarks'
                  style={styles.controlFooterIcon}
                  size={25}
                  color={config.css.color.appBlack}/>
                <Text style={styles.controlFooterTitle}>书签</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlFooterItem} onPress={this._showListModal.bind(this)}>
                <Icon 
                  name='ios-list-box'
                  style={styles.controlFooterIcon}
                  size={25}
                  color={config.css.color.appBlack}/>
                <Text style={styles.controlFooterTitle}>目录</Text>
              </TouchableOpacity>
            </View>
          </View>
        :
          null
        }
        <Modal
          visible={this.state.showSaveModal}
          animationType = {'none'}
          transparent = {true}>
          <TouchableOpacity 
            style={styles.modal} 
            activeOpacity={1}
            onPress={() => this._closeModal()}>
            <View style={styles.innerView} >
              <Text style={styles.modalTitle}>添书</Text>
              <Text style={styles.modalBody}>是否将本书加入到书架?</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.modalButton} onPress={this._toPop.bind(this)}>不了</Text>
                <Text style={styles.modalButton} onPress={this._toSaveAndPop.bind(this)}>加入书架</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          visible={this.state.showListModal}
          animationType = {'fade'}
          transparent = {true}>
          <TouchableOpacity 
            style={styles.listModal} 
            activeOpacity={1}
            onPress={() => this._closeListModal()}>
            <Text style={styles.listModalTitle}>{this.state.bookName}</Text>
            <ListView 
              style={styles.innerListView}
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(readPlatform.bookChapter ? readPlatform.bookChapter.chapters : [])}
              renderRow={this.renderListModal.bind(this)}/>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTitle: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: 'bold',
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title
  },
  textBody: {
    margin: 15,
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    lineHeight: 30
  },
  control: {
    height: config.css.headerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: config.css.color.appMainColor
  },
  controlHeaderTitle: {
    marginRight: 14, 
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.title
  },
  controlFooterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlFooterTitle: {
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.desc
  },
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
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.title,
  },
  modalButton: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.appMainColor,
  },
  listModal: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  innerListView: {
    backgroundColor: '#fff3df',
    width: Dimen.window.width - 60,
    flex: 1
  },
  listModalTitle: {
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
    backgroundColor: '#fff3df',
    width: Dimen.window.width - 60,
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderColor: config.css.color.line
  },
  listModalText: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: config.css.color.line
  }
})

function mapStateToProps(store) {
  const { readPlatform } = store;
  return {
    readPlatform
  }
}

export default connect(mapStateToProps)(ReadPlatform)