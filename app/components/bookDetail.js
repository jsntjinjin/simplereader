/*
 * description: the detail of book
 * author: 麦芽糖
 * time: 2017年03月15日10:26:53
 */

import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  ListView,
  TouchableOpacity,
  ScrollView
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import ReadPlatform from './readPlatform'
import BookListDetail from './discover/bookListDetail'
import StarLevel from '../weight/starLevel'
import TagsGroup from '../weight/tagsGroup'
import request from '../utils/httpUtil'
import Dimen from '../utils/dimensionsUtil'
import api from '../common/api'
import config from '../common/config'

export default class BookDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hasSaveBook: false,
      longInTroLineNumber: 2,
      bookDetail: '',
      hotReview: [],
      recommendBookList: []
    }
  }

  componentDidMount() {
    // var array = this.props.navigator.getCurrentRoutes();
    // array.forEach(function(element) {
    //   console.log(element)
    // }, this);
    // const {dispatch} = this.props
    var bookId = this.props.bookId
    this._getBookDetail(bookId)
    this._getHotReview(bookId)
    this._getRecommendBookList(bookId)
    this.hasSaveBook(bookId)
  }

  _getBookDetail(bookId) {
    request.get(api.BOOK_DETAIL(bookId), null)
      .then((data) => {
        this.setState({bookDetail: data})
      })
      .catch((err) => {
        console.log(err)
        this.setState({bookDetail: null})
      })
  }

  _getHotReview(bookId) {
    request.get(api.BOOK_HOT_REVIEW, {book: bookId})
      .then((data) => {
        if(data.ok){
          this.setState({hotReview: data.reviews})
        } else {
          this.setState({hotReview: []})
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({hotReview: []})
      })
  }

  _getRecommendBookList(bookId) {
    request.get(api.BOOK_RECOMMEND_BOOK_LIST(bookId), {limit: 3})
      .then((data) => {
        if(data.ok){
          this.setState({recommendBookList: data.booklists})
        } else {
          this.setState({recommendBookList: []})
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({recommendBookList: []})
      })
  }

  /**
   * 是否已经保存过当前书籍
   * @param {string} bookId 书籍id
   */
  hasSaveBook(bookId) {
    var book = realm.objectForPrimaryKey('HistoryBook', bookId)
    this.setState({hasSaveBook: book ? book.isToShow : false})
    console.log('是否已经保存过当前书籍', book ? book.isToShow : false)
  }

  /**
   * 向数据库中保存当前书籍的记录
   */
  saveBookToRealm(bookDetail) {
    var books = realm.objects('HistoryBook').sorted('sortNum')
    var book = realm.objectForPrimaryKey('HistoryBook', bookDetail._id)
    realm.write(() => {
      if(book) {
        realm.create('HistoryBook', {bookId: bookDetail._id, isToShow: true}, true)
      } else {
        realm.create('HistoryBook', {
          bookId: bookDetail._id,
          bookName: bookDetail.title,
          bookUrl: bookDetail.cover,
          lastChapterTitle: bookDetail.lastChapter,
          historyChapterNum: 0,
          lastChapterTime: bookDetail.updated,
          saveTime: new Date(),
          sortNum: books && books.length > 0 ? books[books.length - 1].sortNum + 1 : 0,
          isToShow: true
        });
      }
    })
  }

  /**
   * 从数据库中删除当前书籍的记录
   */
  deleteBookToRealm(bookDetail) {
    let book = realm.objectForPrimaryKey('HistoryBook', bookDetail._id)
    realm.write(() => {
      realm.create('HistoryBook', {bookId: bookDetail._id, isToShow: false}, true)
    })
  }

  /**
   * 添加或删除数据库中相关书籍
   */
  _addOrDeleteBook(bookDetail) {
    if (this.state.hasSaveBook) {
      this.deleteBookToRealm(bookDetail)
    } else {
      this.saveBookToRealm(bookDetail)
    }
    this.hasSaveBook(bookDetail._id)
  }

  /**
   * 进入阅读界面
   */
  _readBook(book) {
    this.props.navigator.push({
      name: 'readPlatform',
        component: ReadPlatform,
        params: {
          bookId: this.state.bookDetail._id
        }
    })
  }

  /**
   * 控制书籍desc的行数
   */
  _showLongInTro() {
    this.setState({
      longInTroLineNumber: this.state.longInTroLineNumber === 2 ? null : 2
    })
  }
  
  /**
   * 进入书籍书评界面
   */
  _moreHotReview() {

  }

  /**
   * 选择tag进入tag推荐书籍页面
   */
  _checkTag(tag) {

  }

  /**
   * 进入书评详情界面
   * @param {string} key 热门书评id
   */
  _reviewDetail(key) {
    console.log(this.state.hotReview[key]._id)
  }

  /**
   * 进入书籍社区
   */
  _toBookCommunity() {
    console.log(this.state.bookDetail._id)
  }

  /**
   * 进入书单详情界面
   * @param {string} key 书单id
   */
  _recommendBookDetail(key) {
    this.props.navigator.push({
      name: 'bookListDetail',
        component: BookListDetail,
        params: {
          bookListId: this.state.recommendBookList[key].id
        }
    })
  }

  _back() {
    this.props.navigator.pop()
  }

  renderHotReview(array) {
    var items = []
    if (array) {
      for (var i = 0; i < array.length; i++) {
        var review = array[i];
        items.push(
          <TouchableOpacity 
            activeOpacity={0.5}
            style={{flex: 1, width: Dimen.window.width - 68, flexDirection: 'row', marginLeft: 14, marginRight: 14}} 
            onPress={this._reviewDetail.bind(this, i)}
            key={i}>
            <Image 
              style={styles.hotReviewImage}
              source={review.author.avatar 
                ? {uri: (api.IMG_BASE_URL + review.author.avatar)} 
                : require('../imgs/splash.jpg')}/>
            <View style={{marginLeft: 14, marginTop: 10}}>
              <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.author, marginTop: 3, marginBottom: 3}}>{review.author.nickname + 'lv.' + review.author.lv}</Text>
              <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.title}}>{review.title}</Text>
              <StarLevel rating={review.rating}/>
              <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.desc, marginTop: 3, marginBottom: 3}} numberOfLines={2}>{review.content}</Text>
              <Icon 
                name='ios-thumbs-up-outline'
                size={15}
                color={config.css.fontColor.desc}>
                <Text style={{fontSize: config.css.fontSize.desc,marginLeft: 5}}>{review.likeCount}</Text>
              </Icon>
            </View>
          </TouchableOpacity>
        )
      }
    }
    return items
  }

  renderRecommendBookList(array) {
    var items = []
    if (array) {
      for (var i = 0; i < array.length; i++) {
        var recommend = array[i];
        items.push(
          <TouchableOpacity 
            activeOpacity={0.5}
            style={{flex: 1, width: Dimen.window.width - 68, flexDirection: 'row', marginLeft: 14, marginRight: 14}} 
            onPress={this._recommendBookDetail.bind(this, i)}
            key={i}>
            <Image 
              style={{height: 60, width: 40, alignSelf: 'center'}}
              source={recommend.cover 
                ? {uri: (api.IMG_BASE_URL + recommend.cover)} 
                : require('../imgs/splash.jpg')}/>
            <View style={{marginLeft: 14, marginTop: 10}}>
              <Text style={{color: config.css.fontColor.title, fontSize: config.css.fontSize.title}}>{recommend.title}</Text>
              <Text style={{marginTop: 5, marginBottom: 5, color: config.css.fontColor.title, fontSize: config.css.fontSize.desc}}>{recommend.author}</Text>
              <Text style={{color: config.css.fontColor.title, fontSize: config.css.fontSize.desc}} numberOfLines={1}>{recommend.desc}</Text>
              <Text style={{marginTop: 5, marginBottom: 5, color: config.css.fontColor.desc, fontSize: config.css.fontSize.desc}}>{'共' + recommend.bookCount + '本书 | ' + recommend.collectorCount + '人收藏'}</Text>
            </View>
          </TouchableOpacity>
        )
      }
    }
    return items
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>书籍详情</Text>
          <Icon 
            name='ios-cloud-download-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}/>
        </View>
        <ScrollView 
          style={styles.body}
          showsVerticalScrollIndicator={false}>
          <View style={styles.bookDetail}>
            <Image 
              style={styles.bookDetailImage}
              source={this.state.bookDetail.cover
                ? {uri: (api.IMG_BASE_URL + this.state.bookDetail.cover)} 
                : require('../imgs/splash.jpg')}/>
            <View style={{justifyContent: 'space-around'}}>
              <Text style={{color: config.css.fontColor.title, fontSize: config.css.fontSize.title}}>{this.state.bookDetail.title}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.bookDetailAuthor}>{this.state.bookDetail.author}</Text>
                <Text style={styles.bookDetailMidText}> | </Text>
                <Text style={styles.bookDetailMidText}>{this.state.bookDetail.minorCate}</Text>
                <Text style={styles.bookDetailMidText}> | </Text>
                <Text style={styles.bookDetailMidText}>{this.state.bookDetail.wordCount + '字'}</Text>
              </View>
              <Text style={styles.bookDetailMidText}>{'更新时间: ' + this.state.bookDetail.updated}</Text>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginLeft: 14, marginRight: 14}}>
            <TouchableOpacity style={this.state.hasSaveBook ? [styles.button1, {backgroundColor: config.css.color.line}] : styles.button1} onPress={() => this._addOrDeleteBook(this.state.bookDetail)}>
              {this.state.hasSaveBook ?
                <Icon
                  name='ios-remove-outline'
                  style={styles.buttonIcon}
                  size={15}
                  color={config.css.color.appBackground} />
              :
                <Icon
                  name='ios-add-outline'
                  style={styles.buttonIcon}
                  size={15}
                  color={config.css.color.appBackground} />
              }
              <Text style={styles.buttonText}>{this.state.hasSaveBook ? '不追了' : '追更新'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={() => this._readBook(this.state.bookDetail)}>
              <Icon
                name='ios-book-outline'
                style={styles.buttonIcon}
                size={15}
                color={config.css.color.appBackground} />
              <Text style={styles.buttonText}>开始阅读</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.line}/>
          <View style={{flex: 1,flexDirection: 'row',justifyContent: 'space-around'}}>
            <View style={styles.bookData}>
              <Text style={styles.bookDataTitle}>追书人数</Text>
              <Text style={styles.bookDataNumber}>{this.state.bookDetail.latelyFollower}</Text>
            </View>
            <View style={styles.bookData}>
              <Text style={styles.bookDataTitle}>读者留存率</Text>
              <Text style={styles.bookDataNumber}>{this.state.bookDetail.retentionRatio + '%'}</Text>
            </View>
            <View style={styles.bookData}>
              <Text style={styles.bookDataTitle}>日更新字数</Text>
              <Text style={styles.bookDataNumber}>{this.state.bookDetail.serializeWordCount}</Text>
            </View>
          </View>
          <View style={styles.line}/>
          <TagsGroup tags={this.state.bookDetail.tags} checkTag={(tag) => this._checkTag(tag)}/>
          <View style={styles.line}/>
          <Text style={styles.bookDataNumber} numberOfLines={this.state.longInTroLineNumber} onPress={this._showLongInTro.bind(this)}>{this.state.bookDetail.longIntro}</Text>
          <View style={styles.hightLine}/>
          <View style={styles.bookHotReviewHeader}>
            <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.desc}}>热门书评</Text>
            <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.title}} onPress={this._moreHotReview}>更多</Text>
          </View>
          {this.renderHotReview(this.state.hotReview).map((item, i) => {
            return item
          })}
          <View style={styles.hightLine}/>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={this._toBookCommunity.bind(this)}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 14, marginRight: 14}}>
              <View>
                <Text style={{fontSize: config.css.fontSize.title, color: config.css.fontColor.title, marginBottom: 10}}>{this.state.bookDetail.title + '的社区'}</Text>
                <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.desc}}>{'共有' + this.state.bookDetail.postCount + '个帖子'}</Text>
              </View>
              <Icon 
                name='ios-arrow-forward-outline'
                size={15}
                color={config.css.color.appTitle} />
            </View>
          </TouchableOpacity>
          <View style={styles.hightLine}/>
          <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.desc, marginLeft: 14, marginRight: 14, marginBottom: 14}}>推荐书单</Text>
          {this.renderRecommendBookList(this.state.recommendBookList).map((item, i) => {
            return item
          })}
        </ScrollView>
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
  bookDetail: {
    flexDirection: 'row',
    margin: 14
  },
  bookDetailImage: {
    marginRight: 14,
    alignSelf: 'center',
    width: 60,
    height: 90
  },
  bookDetailMidText: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
  },
  bookDetailAuthor: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.appMainColor,
  },
  button1: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    backgroundColor: config.css.color.buttonColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  button2: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    backgroundColor: config.css.color.buttonColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  buttonIcon: {
    marginRight: 14
  },
  buttonText: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.white
  },
  line: {flex: 1,height: 1, backgroundColor: config.css.color.line, margin: 14},
  hightLine: {flex: 1,height: 10, backgroundColor: config.css.color.line, marginTop: 14, marginBottom: 14},
  bookDataTitle: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginBottom: 5,
    alignSelf: 'center'
  },
  bookDataNumber: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.title,
    marginLeft: 14,
    marginRight: 14
  },
  bookHotReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 14,
    marginRight: 14
  },
  hotReviewImage: {
    width: 40,
    height: 40,
    marginTop: 20,
    borderRadius: 20
  }
})
