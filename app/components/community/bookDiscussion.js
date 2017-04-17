/*
 * description: 综合讨论区/原创区
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

import BookDiscussionDetail from './bookDiscussionDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import {bookDiscussionList} from '../../actions/bookDiscussionAction'
import SelectionTabs from '../../weight/selectionTabs'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabArray = [config.distillate, config.discussionSort]

class BookDiscussion extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sort: 'updated',
      distillate: ''
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(bookDiscussionList(this._setParams(this.state.sort, this.state.distillate, 0), true, []))
  }

  _setParams(sort, distillate, start) {
    return {block: this.props.block, duration: 'all', sort: sort, type: 'all', start: start, limit: 20, distillate: distillate}
  }

  _back() {
    this.props.navigator.pop()
  }

  _changeState(selected) {
    console.log('selected', selected)
    const {dispatch} = this.props
    this.setState({distillate: selected[0].distillate, sort: selected[1].sort})
    dispatch(bookDiscussionList(this._setParams(selected[1].sort, selected[0].distillate, 0), true, []))
  }

  _showMoreItem() {
    const {bookDiscussion, dispatch} = this.props
    if(bookDiscussion.bookDiscussionList.length === 0 || bookDiscussion.isLoadingBookDiscussionList || bookDiscussion.isLoadingBookDiscussionListMore){
      return
    }
    dispatch(bookDiscussionList(this._setParams(this.state.sort, this.state.distillate, bookDiscussion.bookDiscussionList.length), false, bookDiscussion.bookDiscussionList))
  }

  _goToBookDiscussionDetail(id) {
    this.props.navigator.push({
      name: 'bookDiscussionDetail',
      component: BookDiscussionDetail,
      params: {
        bookDiscussionId: id
      }
    })
  }

  renderBookDiscussion(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToBookDiscussionDetail(rowData._id)}>
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
              <Text style={styles.itemTime}>{rowData.updated}</Text>
            </View>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
              <Icon 
                name='ios-chatbubbles-outline'
                size={15}
                color={config.css.fontColor.desc}>
              </Icon>
              <Text style={styles.itemDesc}>{rowData.commentCount}</Text>
              <Icon 
                name='ios-stats-outline'
                size={15}
                style={{marginLeft: 10}}
                color={config.css.fontColor.desc}>
              </Icon>
              <Text style={styles.itemDesc}>{rowData.voteCount}</Text>
              <Icon 
                name='ios-heart-outline'
                size={15}
                style={{marginLeft: 10}}
                color={config.css.fontColor.desc}>
              </Icon>
              <Text style={styles.itemDesc}>{rowData.likeCount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    const {bookDiscussion} = this.props
    if (bookDiscussion.bookDiscussionList.length === 0 || bookDiscussion.isLoadingBookDiscussionList) {
      return null
    }
    return (
      <Text style={styles.bookListFooter}>正在加载更多~~~</Text>
    ) 
  }

  render() {
    const {bookDiscussion} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>综合讨论区</Text>
        </View>
        <SelectionTabs tabArray={tabArray} selectItem={(selected) => this._changeState(selected)}/>
        {bookDiscussion.isLoadingBookDiscussionList ? 
            <Text style={styles.body}>正在加载中~~~</Text>
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(bookDiscussion.bookDiscussionList)}
              onEndReached={this._showMoreItem.bind(this)}
              onEndReachedThreshold={30}
              renderRow={this.renderBookDiscussion.bind(this)}
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
    marginLeft: 3
  },
  bookListFooter: {
    height: 30,
    width: Dimen.window.width,
    textAlign: 'center'
  }
})

function mapStateToProps(store) {
  const { bookDiscussion } = store
  return {
    bookDiscussion
  }
}

export default connect(mapStateToProps)(BookDiscussion)