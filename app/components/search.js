/*
 * description: 搜索页面
 * author: 麦芽糖
 * time: 2017年03月12日15:44:34
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
  ScrollView,
  InteractionManager
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

import TagsGroup from '../weight/tagsGroup'
import request from '../utils/httpUtil'
import Dimen from '../utils/dimensionsUtil'
import api from '../common/api'
import config from '../common/config'
import BookDetail from './bookDetail'

export default class Search extends Component {

  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      searchWords: '',
      searchState: false,
      searchData: ds.cloneWithRows([]),
      autoComplete: ds.cloneWithRows([]),
      hotPart: 0,
      hotWords: ds.cloneWithRows([]),
      hotWordsPart: ds.cloneWithRows([]),
      searchHistory: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    // 请求热词,和获取历史搜索数据
    let searchW = this.props.searchWord
    InteractionManager.runAfterInteractions(()=>{
      this._searchHotWords()
      this._storageSelectSearchHistory()
    })
    if (searchW) {
      this._changeSearchWord(searchW)
    }
  }

  /**
   * 获取热词
   */
  _searchHotWords() {
    request.get(api.SEARCH_HOT_WORD, null)
      .then((data) => {
        if(data.ok) {
          this.setState({hotWords: data.hotWords})
          this._refreshHotWord()
        }
      })
  }

  _stringArrayToObjectArray(temp) {
    var array = new Array()
    for (var i = 0; i < temp.length; i++) {
      var element = temp[i];
      var o = new Object()
      o.word = element
      array.push(o)
    }
    return array
  }

  /**
   * 搜索关键字
   * @param {string} text 输入的关键字
   */
  _searchAutoComplete(text) {
    this.setState({searchWords: text})
    if (text) {
      request.get(api.SEARCH_AUTO_COMPLETE, {query: text})
        .then((data) => {
          if(data.ok) {
            var array = this._stringArrayToObjectArray(data.keywords)
            this.setState({autoComplete: this.state.autoComplete.cloneWithRows(array)})
          }
        })  
    } else {
      this.setState({autoComplete: this.state.autoComplete.cloneWithRows([])})
    } 
  }

  /**
   * 按照输入的书名搜索符合的书的列表
   * @param {string} text 输入的书名
   */
  _submit(text) {
    if(text) {
      this._storageSaveSearchHistory(text)
      request.get(api.SEARCH_BOOKS, {query: text})
        .then((data) => {
          if(data.ok){
            this.setState({
              searchData: this.state.searchData.cloneWithRows(data.books),
              searchState: true,
              autoComplete: this.state.autoComplete.cloneWithRows([])
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  _storageSelectSearchHistory() {
    storage.load({
      key: 'search'
    })
    .then(ret => {
      var array = this._stringArrayToObjectArray(ret.search)
      this.setState({searchHistory: this.state.autoComplete.cloneWithRows(array)})
    })
  }

  _storageSaveSearchHistory(text) {
    storage.load({
      key: 'search'
    })
    .then(ret => {
      var index = ret.search.indexOf(text)
      if (index > -1) {
        ret.search.splice(index, 1)
      }
      ret.search.unshift(text)
      var searchStorage = {
          search: []
        }
      searchStorage.search = ret.search
      storage.save({key: 'search', rawData: searchStorage})
      var array = this._stringArrayToObjectArray(ret.search)
      this.setState({searchHistory: this.state.autoComplete.cloneWithRows(array)})
    })
    .catch(err => {
      if(err.name == 'NotFoundError'){
        var searchStorage = {
          search: []
        }
        searchStorage.search.push(text)
        storage.save({key: 'search', rawData: searchStorage})
        var array = this._stringArrayToObjectArray(searchStorage.search)
        this.setState({searchHistory: this.state.autoComplete.cloneWithRows(array)})
      }else{
        console.warn(err)
      }
    })
  }

  _storageRemoveSearchHistory() {
    storage.remove({
      key: 'search'
    })
    this.setState({searchHistory: this.state.searchHistory.cloneWithRows([])})
  }

  /**
   * 跳转书的介绍页面
   * @param {string} rowData 书的信息
   */
  _startReadDetail(rowData) {
    this.props.navigator.push({
      name: 'bookDetail',
      component: BookDetail,
      params: {
        bookId: rowData._id
      }
    })
  }

  /**
   * 修改关键字
   * @param {string} word 关键字
   */
  _changeSearchWord(word) {
    this._submit(word)
    this.setState({
      searchWords: word,
      autoComplete: this.state.autoComplete.cloneWithRows([]),
    })
  }

  _refreshHotWord() {
    var part = (this.state.hotPart + 1) % 4
    var words = []
    if (8 * (part + 1) < this.state.hotWords.length) {
      words = this.state.hotWords.slice(8 * part, 8 * (part + 1))
    } else {
      words = this.state.hotWords.slice(8 * part)
    }
    this.setState({hotPart: part, hotWordsPart: words})
  }

  _back() {
    if (this.state.searchState) {
      this.setState({searchState: false, searchWords: '', autoComplete: this.state.autoComplete.cloneWithRows([])})
    }else{
      this.props.navigator.pop()
    }
  }

  renderAutoComplete(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._changeSearchWord(rowData.word)}
        style={styles.autoItem}>
        <Text>{rowData.word}</Text>
      </TouchableOpacity>
    )
  }

  renderSearchData(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._startReadDetail(rowData)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.cover 
              ? {uri: (api.IMG_BASE_URL + rowData.cover)} 
              : require('../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <Text style={styles.itemDesc}>{
              rowData.latelyFollower + '人在追 | ' 
              + (rowData.retentionRatio ? rowData.retentionRatio : 0) + '%读者留存 | '
              + rowData.author + '著'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderSearchHistory(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._changeSearchWord(rowData.word)}>
        <View style={styles.historyItem}>
          <Icon 
            name='ios-clock-outline'
            color={config.css.color.appBlack}
            size={20} />
          <Text style={styles.historyItemText}>{rowData.word}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {hotWords} = this.state.hotWords
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <TextInput 
            style={styles.headerTextInput}
            value={this.state.searchWords}
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='搜索...'
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._searchAutoComplete(text)}
            onSubmitEditing={(event) => this._submit(event.nativeEvent.text)}/>
        </View>
        <ScrollView style={styles.body}>
          {this.state.searchState ? 
            // 显示搜索结果
            <ListView 
              enableEmptySections={true}
              dataSource={this.state.searchData}
              renderRow={this.renderSearchData.bind(this)}/> 
          :
            // 显示历史记录和热门搜索
            <View>
              <View style={styles.hotWordsHeader}>
                <Text style={styles.hotWordsHeaderText}>大家都在搜</Text>
                <Icon
                  name='ios-refresh-outline'
                  size={20}
                  style={{marginTop: 2}}
                  color={config.css.color.appBlack}
                  onPress={this._refreshHotWord.bind(this)}>
                </Icon>
                <Text 
                  style={{fontSize: config.css.fontSize.desc, marginLeft: 5, marginRight: 30}}
                  onPress={this._refreshHotWord.bind(this)}>
                  换一批
                </Text>
              </View>
              <TagsGroup tags={this.state.hotWordsPart} checkTag={(tag) => this._changeSearchWord(tag)}/>
              <View style={styles.hotWordsHeader}>
                <Text style={styles.hotWordsHeaderText}>搜索历史</Text>
                <Icon
                  name='ios-trash'
                  size={20}
                  style={{marginTop: 2}}
                  color={config.css.color.appBlack}
                  onPress={this._storageRemoveSearchHistory.bind(this)}>
                </Icon>
                <Text 
                  style={{fontSize: config.css.fontSize.desc, marginLeft: 5, marginRight: 30}}
                  onPress={this._storageRemoveSearchHistory.bind(this)}>
                  清空
                </Text>
              </View>
              <ListView
                enableEmptySections={true}
                dataSource={this.state.searchHistory}
                renderRow={this.renderSearchHistory.bind(this)}/>
            </View>
          }
          {this.state.autoComplete ? 
            <ListView 
              style={{position: 'absolute'}}
              enableEmptySections={true}
              dataSource={this.state.autoComplete}
              renderRow={this.renderAutoComplete.bind(this)}/>
          : 
            null 
          }
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
  headerTextInput: {
    flex: 1,
    marginLeft: 20,
    padding: 0
  },
  body: {
    // flex: 1
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
  },
  autoItem: {
    height: 30, 
    width: Dimen.window.width - 60,
    justifyContent: 'center',
    paddingLeft: 20,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: config.css.color.appBackground,
    borderColor: config.css.color.line,
    borderWidth: 1
  },
  hotWordsHeader: {
    height: 30,
    width: Dimen.window.width,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginLeft: 14,
    marginRight: 14,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hotWordsHeaderText: {
    flex: 1,
    fontSize: config.css.fontSize.desc
  },
  historyItem: {
    height: 30, 
    width: Dimen.window.width - 48,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 24,
    marginRight: 24,
  },
  historyItemIcon: {
    marginTop: 2
  },
  historyItemText: {
    marginLeft: 10,
    fontSize: config.css.fontSize.desc
  }
})
