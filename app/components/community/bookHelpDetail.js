/*
 * description: 书荒互助区详情
 * author: 麦芽糖
 * time: 2017年04月16日23:08:56
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
import Search from '../search'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import {dateFormat} from '../../utils/formatUtil'
import StarLevel from '../../weight/starLevel'
import api from '../../common/api'
import {bookHelpDetail, 
  bookHelpDetailCommentList,
  bookHelpDetailCommentBest
} from '../../actions/bookHelpAction'
import Loading from '../../weight/loading'
import LoadingMore from '../../weight/loadingMore'
import ToolBar from '../../weight/toolBar'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class BookHelpDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: ''
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    const _id = this.props.bookHelpId
    this.setState({id: _id})
    InteractionManager.runAfterInteractions(()=>{
      dispatch(bookHelpDetail(_id))
      dispatch(bookHelpDetailCommentBest(_id))
      dispatch(bookHelpDetailCommentList(_id, {start: 0, limit: 30}, true, []))
    })
  }

  _back() {
    this.props.navigator.pop()
  }

  _showMoreItem() {
    const {bookHelp, dispatch, _id} = this.props
    if(bookHelp.bookHelpCommentList.length === 0 
      || bookHelp.isLoadingBookHelpCommentList 
      || bookHelp.isLoadingBookHelpCommentListMore 
      || bookHelp.bookHelpCommentList.length >= bookHelp.totalComment){
      return
    }
    dispatch(bookHelpDetailCommentList(this.state.id, {start: bookHelp.bookHelpCommentList.length, limit: 30}, false, bookHelp.bookHelpCommentList))
  }

  _goToSearch(word) {
    this.props.navigator.push({
      name: 'search',
      component: Search,
      params: {
        searchWord: word
      }
    })
  }

  renderBookHelpCommentBest(rowData) {
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

  renderBookHelpComment(rowData) {
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
    const {bookHelp} = this.props
    return (
      <View>
        {bookHelp.bookHelpDetail ?
          <View>
            <View style={{paddingTop: 10, flexDirection: 'row', alignItems: 'center'}}>
              <Image 
                style={styles.authorImage}
                source={bookHelp.bookHelpDetail.author.avatar 
                  ? {uri: (api.IMG_BASE_URL + bookHelp.bookHelpDetail.author.avatar)} 
                  : require('../../imgs/splash.jpg')}
                />
              <View style={styles.authorBody}>
                <Text style={styles.authorTitle}>{bookHelp.bookHelpDetail.author.nickname}</Text>
                <Text style={styles.authorCreateTime}>{dateFormat(bookHelp.bookHelpDetail.created)}</Text>
              </View>
            </View>
            <Text style={styles.detailTitle}>{bookHelp.bookHelpDetail.title}</Text>
            <Text style={styles.detailContent}>{bookHelp.bookHelpDetail.content}</Text>
            {bookHelp.bookHelpDetailCommentBest.length !== 0 ?
                <View>
                  <Text style={styles.listHeader}>仰望神评论</Text>
                  <ListView
                    enableEmptySections={true}
                    dataSource={ds.cloneWithRows(bookHelp.bookHelpDetailCommentBest)}
                    renderRow={this.renderBookHelpCommentBest.bind(this)}/>
                </View>
              : 
                null
            }
            <Text style={styles.listHeader}>
              {'共' + bookHelp.totalComment + '条评论'}
            </Text>
          </View>
          : 
          null
        }
      </View>
    )
  }

  renderFooter() {
    const {bookHelp} = this.props
    if (bookHelp.bookHelpCommentList.length === 0 || bookHelp.isLoadingBookHelpCommentList) {
      return null
    }
    if (bookHelp.bookHelpCommentList.length < bookHelp.totalComment) {
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
    const {bookHelp} = this.props
    return (
      <View style={styles.container}>
        <ToolBar 
          leftClick={this._back.bind(this)}
          title='详情'/>
        {bookHelp.isLoadingBookHelpCommentList ? 
            <Loading />
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(bookHelp.bookHelpCommentList)}
              onEndReached={this._showMoreItem.bind(this)}
              onEndReachedThreshold={30}
              renderRow={this.renderBookHelpComment.bind(this)}
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
  const { bookHelp } = store
  return {
    bookHelp
  }
}

export default connect(mapStateToProps)(BookHelpDetail)
