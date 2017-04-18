/*
 * description: 主题书单tab页面
 * author: 麦芽糖
 * time: 2017年04月18日10:48:54
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

import request from '../../utils/httpUtil'
import BookDetail from '../bookDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import BookListDetail from './bookListDetail'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class BookListTab extends Component {

  static propTypes = {
    duration: React.PropTypes.string,
    sort: React.PropTypes.string,
    gender: React.PropTypes.string,
    tag: React.PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isLoadingMore: false,
      bookLists: [],
      total: 0
    }
  }

  _setTabParams(duration, sort, tag, gender, start) {
    return {duration: duration, sort: sort, start: start, tag: tag, gender: gender, limit: 20}
  }

  componentDidMount() {
    let params = this._setTabParams(this.props.duration, this.props.sort, this.props.tag, this.props.gender, 0)
    this._getBookListTabDetail(params)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tag !== this.props.tag) {
      this.setState({bookLists: [], total: 0})
      let params = this._setTabParams(nextProps.duration, nextProps.sort, nextProps.tag, nextProps.gender, 0)
      this._getBookListTabDetail(params)
    }
  }

  _getBookListTabDetail(params) {
    if (this.state.bookLists.length === 0) {
      this.setState({isLoading: true})
    } else {
      this.setState({isLoadingMore: true})
    }
    request.get(api.DISCOVER_BOOK_LIST, params)
      .then((data) => {
        if (data.ok) {
          if (this.state.bookLists.length === 0) {
            this.setState({
              isLoading: false,
              bookLists: data.bookLists,
              total: data.total
            })
          } else {
            this.setState({
              isLoadingMore: false,
              bookLists: this.state.bookLists.concat(data.bookLists),
              total: data.total
            })
          }
        } else {
          this.setState({
            isLoading: false,
            isLoadingMore: false,
          })
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          isLoading: false,
          isLoadingMore: false,
        })
      })
  }

  _back() {
    this.props.navigator.pop()
  }

  _showMoreItem() {
    if(this.state.bookLists.length === 0 || this.state.isLoading || this.state.isLoadingMore || this.state.bookLists.length === this.state.total){
      return
    }
    let params = this._setTabParams(this.props.duration, this.props.sort, this.props.tag, this.props.gender, this.state.bookLists.length)
    this._getBookListTabDetail(params)
  }

  _goToBookListDetail(rowData) {
    this.props.navigator.push({
      name: 'bookListDetail',
      component: BookListDetail,
      params: {
        bookListId: rowData._id
      }
    })
  }

  renderBookList(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToBookListDetail(rowData)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.cover 
              ? {uri: (api.IMG_BASE_URL + rowData.cover)} 
              : require('../../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <Text style={styles.itemDesc}>{rowData.author}</Text>
            <Text style={styles.itemDesc} numberOfLines={1}>{rowData.desc}</Text>
            <Text style={styles.itemDesc}>{'共' + rowData.bookCount + '本书 | ' + rowData.collectorCount + '人收藏'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    if (this.state.bookLists.length === 0 || this.state.isLoading) {
      return null
    }
    if (this.state.bookLists.length < this.state.total) {
      return (
        <Text style={styles.bookListFooter}>正在加载更多~~~</Text>
      )
    } else {
      return (
        <Text style={styles.bookListFooter}>没有更多书单了~~~</Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? 
            <Text style={{flex: 1, textAlign: 'center'}}>正在加载中~~~</Text>
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(this.state.bookLists)}
              onEndReached={this._showMoreItem.bind(this)}
              onEndReachedThreshold={30}
              renderRow={this.renderBookList.bind(this)}
              renderFooter={this.renderFooter.bind(this)}/>
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
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
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
  bookListFooter: {
    height: 30,
    width: Dimen.window.width,
    textAlign: 'center'
  }
})
