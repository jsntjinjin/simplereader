/*
 * description: 书评详情
 * author: 麦芽糖
 * time: 2017年04月16日16:11:58
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
import { connect } from 'react-redux'

import BookDetail from '../bookDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import {dateFormat} from '../../utils/formatUtil'
import StarLevel from '../../weight/starLevel'
import api from '../../common/api'
import {bookReviewDetail, 
  bookReviewDetailCommentList,
  bookReviewDetailCommentBest
} from '../../actions/bookReviewAction'
import Loading from '../../weight/loading'
import LoadingMore from '../../weight/loadingMore'
import ToolBar from '../../weight/toolBar'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class BookReviewDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: ''
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    const _id = this.props.bookReviewId
    this.setState({id: _id})
    InteractionManager.runAfterInteractions(()=>{
      dispatch(bookReviewDetail(_id))
      dispatch(bookReviewDetailCommentBest(_id))
      dispatch(bookReviewDetailCommentList(_id, {start: 0, limit: 30}, true, []))
    })
  }

  _back() {
    this.props.navigator.pop()
  }

  _showMoreItem() {
    const {bookReview, dispatch, _id} = this.props
    if(bookReview.bookReviewCommentList.length === 0 
      || bookReview.isLoadingBookReviewCommentList 
      || bookReview.isLoadingBookReviewCommentListMore 
      || bookReview.bookReviewCommentList.length >= bookReview.totalComment){
      return
    }
    dispatch(bookReviewDetailCommentList(this.state.id, {start: bookReview.bookReviewCommentList.length, limit: 30}, false, bookReview.bookReviewCommentList))
  }

  _goToBookDetail(id) {
    this.props.navigator.push({
      name: 'bookDetail',
      component: BookDetail,
      params: {
        bookId: id
      }
    })
  }

  renderBookReviewCommentBest(rowData) {
    return (
      <View style={styles.item}>
        <Image 
          style={styles.itemImage}
          source={rowData.author.avatar 
            ? {uri: (api.IMG_BASE_URL + rowData.author.avatar)} 
            : require('../../imgs/splash.jpg')}
          />
        <View style={styles.itemBody}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={styles.itemDesc}>{rowData.floor + '楼'}</Text>
            <Text style={styles.itemAuthor}>{rowData.author.nickname + ' lv.' + rowData.author.lv}</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 14}}>
              <Icon 
                name='ios-heart-outline'
                size={15}
                color={config.css.fontColor.desc}>
              </Icon>
              <Text style={styles.itemDesc}>{rowData.likeCount + '次同感'}</Text>
            </View>
          </View>
          <Text style={styles.itemTitle}>{rowData.content}</Text>
        </View>
      </View>
    )
  }

  renderBookReviewComment(rowData) {
    return (
      <View style={styles.item}>
        <Image 
          style={styles.itemImage}
          source={rowData.author.avatar 
            ? {uri: (api.IMG_BASE_URL + rowData.author.avatar)} 
            : require('../../imgs/splash.jpg')}
          />
        <View style={styles.itemBody}>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={styles.itemDesc}>{rowData.floor + '楼'}</Text>
            <Text style={styles.itemAuthor}>{rowData.author.nickname + ' lv.' + rowData.author.lv}</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 14}}>
              <Text style={styles.itemDesc}>{dateFormat(rowData.created)}</Text>
            </View>
          </View>
          <Text style={styles.itemTitle}>{rowData.content}</Text>
        </View>
      </View>
    )
  }

  renderHeader() {
    const {bookReview} = this.props
    return (
      <View>
        {bookReview.bookReviewDetail ?
          <View>
            <View style={{paddingTop: 10, flexDirection: 'row', alignItems: 'center'}}>
              <Image 
                style={styles.authorImage}
                source={bookReview.bookReviewDetail.author.avatar 
                  ? {uri: (api.IMG_BASE_URL + bookReview.bookReviewDetail.author.avatar)} 
                  : require('../../imgs/splash.jpg')}
                />
              <View style={styles.authorBody}>
                <Text style={styles.authorTitle}>{bookReview.bookReviewDetail.author.nickname}</Text>
                <Text style={styles.authorCreateTime}>{dateFormat(bookReview.bookReviewDetail.created)}</Text>
              </View>
            </View>
            <Text style={styles.detailTitle}>{bookReview.bookReviewDetail.title}</Text>
            <Text style={styles.detailContent}>{bookReview.bookReviewDetail.content}</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => this._goToBookDetail(bookReview.bookReviewDetail.book._id)}>
              <View style={styles.bookBody}>
                <Image 
                  style={{height: 60, width: 45, alignSelf: 'center'}}
                  source={bookReview.bookReviewDetail.book.cover 
                    ? {uri: (api.IMG_BASE_URL + bookReview.bookReviewDetail.book.cover)} 
                    : require('../../imgs/splash.jpg')}/>
                <View style={{marginLeft: 14, alignSelf: 'center'}}>
                  <Text style={{fontSize: config.css.fontSize.title, color: config.css.fontColor.title}}>{bookReview.bookReviewDetail.book.title}</Text>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{fontSize: config.css.fontSize.desc, color: config.css.fontColor.desc}}>楼主打分: </Text>
                    <StarLevel rating={bookReview.bookReviewDetail.rating}/>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.listHeader}>给书评打分</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10}}>
              <View style={{alignItems: 'center'}}>
                <Text>{bookReview.bookReviewDetail.helpful.yes}</Text>
                <Icon 
                  name='ios-thumbs-up-outline'
                  size={15}
                  color={config.css.fontColor.desc}>
                  <Text style={{fontSize: config.css.fontSize.desc}}>赞同</Text>
                </Icon>
              </View> 
              <View style={{alignItems: 'center'}}>
                <Text>{bookReview.bookReviewDetail.helpful.no}</Text>
                <Icon 
                  name='ios-thumbs-down-outline'
                  size={15}
                  color={config.css.fontColor.desc}>
                  <Text style={{fontSize: config.css.fontSize.desc}}>反对</Text>
                </Icon>
              </View> 
            </View>
            {bookReview.bookReviewDetailCommentBest.length !== 0 ?
                <View>
                  <Text style={styles.listHeader}>仰望神评论</Text>
                  <ListView
                    enableEmptySections={true}
                    dataSource={ds.cloneWithRows(bookReview.bookReviewDetailCommentBest)}
                    renderRow={this.renderBookReviewCommentBest.bind(this)}/>
                </View>
              : 
                null
            }
            <Text style={styles.listHeader}>
              {'共' + bookReview.totalComment + '条评论'}
            </Text>
          </View>
          : 
          null
        }
      </View>
    )
  }

  renderFooter() {
    const {bookReview} = this.props
    if (bookReview.bookReviewCommentList.length === 0 || bookReview.isLoadingBookReviewCommentList) {
      return null
    }
    if (bookReview.bookReviewCommentList.length < bookReview.totalComment) {
      return (
        <LoadingMore hasMore={true} />
      )
    } else {
      return (
        <LoadingMore hasMore={false} />
      )
    }
  }

  render() {
    const {bookReview} = this.props
    return (
      <View style={styles.container}>
        <ToolBar 
          leftClick={this._back.bind(this)}
          title='详情'/>
        {bookReview.isLoadingBookReviewCommentList ? 
            <Loading />
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(bookReview.bookReviewCommentList)}
              onEndReached={this._showMoreItem.bind(this)}
              onEndReachedThreshold={30}
              renderRow={this.renderBookReviewComment.bind(this)}
              renderHeader={this.renderHeader.bind(this)}
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
  body: {
    flex: 1
  },
  authorImage: {
    marginLeft: 14,
    marginRight: 14,
    width: 40,
    height: 40,
    borderRadius: 20
  },
  authorBody: {
    flex: 1,
    justifyContent: 'space-around'
  },
  authorTitle: {
    fontSize: config.css.fontSize.desc, 
    color: config.css.fontColor.author,
  },
  authorCreateTime: {
    fontSize: config.css.fontSize.desc, 
    color: config.css.fontColor.desc,
  },
  detailTitle: {
    fontSize: config.css.fontSize.title, 
    color: config.css.fontColor.title,
    marginTop: 20,
    marginLeft: 14,
    marginRight: 14
  },
  detailContent: {
    fontSize: config.css.fontSize.desc, 
    color: config.css.fontColor.desc,
    margin: 14
  },
  bookBody: {
    flex: 1, 
    flexDirection: 'row', 
    marginLeft: 14, 
    marginRight: 14,
    marginBottom: 14,
    padding: 10,
    backgroundColor: config.css.color.line,
  },
  listHeader: {
    paddingTop: 10, 
    paddingBottom: 10, 
    paddingLeft: 14, 
    backgroundColor: config.css.color.line
  },
  item: {
    flexDirection: 'row',
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20
  },
  itemBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemAuthor: {
    fontSize: config.css.fontSize.desc, 
    color: config.css.fontColor.author,
    marginLeft: 5
  },
  itemTime: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginRight: 14,
  },
  itemTitle: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.title,
    marginRight: 14,
    marginTop: 5,
    marginBottom: 10
  },
  itemDesc: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
  },
})

function mapStateToProps(store) {
  const { bookReview } = store
  return {
    bookReview
  }
}

export default connect(mapStateToProps)(BookReviewDetail)
