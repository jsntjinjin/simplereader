/*
 * description: 书籍详情书评tab
 * author: 麦芽糖
 * time: 2017年04月19日15:14:49
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

import BookReviewDetail from '../community/bookReviewDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import {dateFormat} from '../../utils/formatUtil'
import api from '../../common/api'
import {bookReviewList} from '../../actions/bookCommunityAction'
import SelectionTabs from '../../weight/selectionTabs'
import StarLevel from '../../weight/starLevel'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabArray = [config.distillate, config.discussionSort]

class BookReviewTab extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    InteractionManager.runAfterInteractions(()=>{
      dispatch(bookReviewList(this._setParams(this.props.bookId, this.props.sort, 0), true, []))
    })
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch} = this.props
    if (nextProps.sort !== this.props.sort) {
      dispatch(bookReviewList(this._setParams(nextProps.bookId, nextProps.sort, 0), true, []))
    }
  }

  _setParams(bookId, sort, start) {
    return {book: bookId, sort: sort, start: start, limit: 20}
  }

  _back() {
    this.props.navigator.pop()
  }

  _showMoreItem() {
    const {bookCommunity, dispatch} = this.props
    if(bookCommunity.bookReviewList.length === 0 || bookCommunity.isLoadingReview || bookCommunity.isLoadingReviewMore || bookCommunity.bookReviewList.length === bookCommunity.bookReviewTotal){
      return
    }
    dispatch(bookReviewList(this._setParams(this.props.bookId, this.props.sort, bookCommunity.bookReviewList.length), false, bookCommunity.bookReviewList))
  }

  _goToBookReviewDetail(id) {
    this.props.navigator.push({
      name: 'bookReviewDetail',
      component: BookReviewDetail,
      params: {
        bookReviewId: id
      }
    })
  }

  renderBookReview(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToBookReviewDetail(rowData._id)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.author.avatar 
              ? {uri: (api.IMG_BASE_URL + rowData.author.avatar)} 
              : require('../../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
              <Text style={styles.itemAuthor}>{rowData.author.nickname + ' lv.' + rowData.author.lv}</Text>
              <Text style={styles.itemTime}>{dateFormat(rowData.updated)}</Text>
            </View>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <StarLevel rating={rowData.rating}/>
            <Text style={styles.itemDesc} numberOfLines={2}>{rowData.content}</Text>
            <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
              <Icon 
                name='ios-thumbs-up-outline'
                size={15}
                color={config.css.fontColor.desc}>
              </Icon>
              <Text style={styles.itemIconText}>{rowData.helpful.yes}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    const {bookCommunity} = this.props
    if (bookCommunity.bookReviewList.length === 0 || bookCommunity.isLoadingReview) {
      return null
    }
    if (bookCommunity.bookReviewList.length < bookCommunity.bookReviewTotal) {
      return (
        <Text style={styles.bookListFooter}>正在加载更多~~~</Text>
      )
    } else {
      return (
        <Text style={styles.bookListFooter}>没有更多了~~~</Text>
      )
    }
  }

  render() {
    const {bookCommunity} = this.props
    return (
      <View style={styles.container}>
        {bookCommunity.isLoadingReview ? 
            <Text style={styles.body}>正在加载中~~~</Text>
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(bookCommunity.bookReviewList)}
              onEndReached={this._showMoreItem.bind(this)}
              onEndReachedThreshold={30}
              renderRow={this.renderBookReview.bind(this)}
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
  listStyle: {
    flexDirection:'row', 
    flexWrap:'wrap',
    backgroundColor: config.css.color.line
  },
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
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
    marginBottom: 5
  },
  itemDesc: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 14,
  },
  itemIconText: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginLeft: 3
  },
  bookListFooter: {
    height: 30,
    width: Dimen.window.width,
    textAlign: 'center'
  }
})

function mapStateToProps(store) {
  const { bookCommunity } = store
  return {
    bookCommunity
  }
}

export default connect(mapStateToProps)(BookReviewTab)

 