/*
 * description: 书架
 * author: 麦芽糖
 * time: 2017年04月04日17:08:01
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  ListView,
  TouchableOpacity,
  View,
  Image,
  Text
} from 'react-native'

import ReadPlatform from '../readPlatform'
import config from '../../common/config'
import api from '../../common/api'
import Dimen from '../../utils/dimensionsUtil'

export default class Bookshelves extends Component {

  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      bookshelves: ds.cloneWithRows([]),
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
      bookshelves: this.state.bookshelves.cloneWithRows(realm.objects('HistoryBook').filtered('isToShow = true').sorted('sortNum', true))
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

  renderBookshelves(rowData) {
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
              rowData.lastChapterTime + ' : ' + rowData.lastChapterTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View>
        {this.state.bookshelves ? 
          <ListView
            enableEmptySections={true}
            dataSource={this.state.bookshelves}
            renderRow={this.renderBookshelves.bind(this)}/>
          : 
          <Text style={{alignSelf: 'center'}}>您还没有收藏过任何书籍哦~~</Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
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