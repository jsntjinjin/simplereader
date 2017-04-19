/*
 * description: 书评区
 * author: 麦芽糖
 * time: 2017年04月05日16:09:39
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

import BookReviewDetail from './bookReviewDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import {dateFormat} from '../../utils/formatUtil'
import api from '../../common/api'
import {bookReviewList} from '../../actions/bookReviewAction'
import SelectionTabs from '../../weight/selectionTabs'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabArray = [config.distillate, config.reviewBookType, config.reviewSort]

class BookReview extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sort: 'updated',
      distillate: '',
      type: 'all'
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(bookReviewList(this._setParams(this.state.sort, this.state.type, this.state.distillate, 0), true, []))
  }

  _setParams(sort, type, distillate, start) {
    return {duration: 'all', sort: sort, type: type, start: start, limit: 20, distillate: distillate}
  }

  _back() {
    this.props.navigator.pop()
  }

  _changeState(selected) {
    const {dispatch} = this.props
    this.setState({distillate: selected[0].distillate, type: selected[1].type, sort: selected[2].sort})
    dispatch(bookReviewList(this._setParams(selected[2].sort, selected[1].type, selected[0].distillate, 0), true, []))
  }

  _showMoreItem() {
    const {bookReview, dispatch} = this.props
    if(bookReview.bookReviewList.length === 0 || bookReview.isLoadingBookReviewList || bookReview.isLoadingBookReviewListMore){
      return
    }
    dispatch(bookReviewList(this._setParams(this.state.sort, this.state.type, this.state.distillate, bookReview.bookReviewList.length), false, bookReview.bookReviewList))
  }

  _checkType(type) {
    for (var key in config.bookType) {
      if (config.bookType.hasOwnProperty(key)) {
        var element = config.bookType[key];
        if (key === type) {
          return element
        } 
      }
    }
  }

  _goToBookReviewDetail(id) {
    this.props.navigator.push({
      name: 'bookDiscussionDetail',
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
            source={rowData.book.cover
              ? {uri: (api.IMG_BASE_URL + rowData.book.cover)} 
              : require('../../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
              <Text style={styles.itemAuthor}>{rowData.book.title + ' [' + this._checkType(rowData.book.type) + ']'}</Text>
              <Text style={styles.itemTime}>{dateFormat(rowData.created)}</Text>
            </View>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
              <Icon 
                name='ios-thumbs-up-outline'
                size={15}
                color={config.css.fontColor.desc}>
              </Icon>
              <Text style={styles.itemDesc}>{rowData.helpful.yes + '人推荐'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    const {bookReview} = this.props
    if (bookReview.bookReviewList.length === 0 || bookReview.isLoadingBookReviewList) {
      return null
    }
    return (
      <Text style={styles.bookListFooter}>正在加载更多~~~</Text>
    ) 
  }

  render() {
    const {bookReview} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>书评区</Text>
        </View>
        <SelectionTabs tabArray={tabArray} selectItem={(selected) => this._changeState(selected)}/>
        {bookReview.isLoadingBookReviewList ? 
            <Text style={styles.body}>正在加载中~~~</Text>
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(bookReview.bookReviewList)}
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
    alignSelf: 'center',
    width: 45,
    height: 60
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
    marginLeft: 3
  },
  bookListFooter: {
    height: 30,
    width: Dimen.window.width,
    textAlign: 'center'
  }
})

function mapStateToProps(store) {
  const { bookReview } = store
  return {
    bookReview
  }
}

export default connect(mapStateToProps)(BookReview)
