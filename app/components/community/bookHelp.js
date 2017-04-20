/*
 * description: 书荒互助区
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
  ListView,
  InteractionManager
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'

import BookHelpDetail from './bookHelpDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import {dateFormat} from '../../utils/formatUtil'
import api from '../../common/api'
import {bookHelpList} from '../../actions/bookHelpAction'
import SelectionTabs from '../../weight/selectionTabs'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var tabArray = [config.distillate, config.discussionSort]

class BookHelp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sort: 'updated',
      distillate: ''
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    InteractionManager.runAfterInteractions(()=>{
      dispatch(bookHelpList(this._setParams(this.state.sort, this.state.distillate, 0), true, []))
    })
  }

  _setParams(sort, distillate, start) {
    return {duration: 'all', sort: sort, start: start, limit: 20, distillate: distillate}
  }

  _back() {
    this.props.navigator.pop()
  }

  _changeState(selected) {
    console.log('selected', selected)
    const {dispatch} = this.props
    this.setState({distillate: selected[0].distillate, sort: selected[1].sort})
    dispatch(bookHelpList(this._setParams(selected[1].sort, selected[0].distillate, 0), true, []))
  }

  _showMoreItem() {
    const {bookHelp, dispatch} = this.props
    if(bookHelp.bookHelpList.length === 0 || bookHelp.isLoadingBookHelpList || bookHelp.isLoadingBookHelpListMore){
      return
    }
    dispatch(bookHelpList(this._setParams(this.state.sort, this.state.distillate, bookHelp.bookHelpList.length), false, bookHelp.bookHelpList))
  }

  _goToBookHelpDetail(id) {
    this.props.navigator.push({
      name: 'bookDiscussionDetail',
      component: BookHelpDetail,
      params: {
        bookHelpId: id
      }
    })
  }

  renderBookHelp(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToBookHelpDetail(rowData._id)}>
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
              <Text style={styles.itemTime}>{dateFormat(rowData.created)}</Text>
            </View>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <View style={{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}}>
              <Icon 
                name='ios-chatbubbles-outline'
                size={15}
                color={config.css.fontColor.desc}>
              </Icon>
              <Text style={styles.itemDesc}>{rowData.commentCount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter() {
    const {bookHelp} = this.props
    if (bookHelp.bookHelpList.length === 0 || bookHelp.isLoadingBookHelpList) {
      return null
    }
    return (
      <Text style={styles.bookListFooter}>正在加载更多~~~</Text>
    ) 
  }

  render() {
    const {bookHelp} = this.props
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
        {bookHelp.isLoadingBookHelpList ? 
            <Text style={styles.body}>正在加载中~~~</Text>
          :
            <ListView
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(bookHelp.bookHelpList)}
              onEndReached={this._showMoreItem.bind(this)}
              onEndReachedThreshold={30}
              renderRow={this.renderBookHelp.bind(this)}
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
  const { bookHelp } = store
  return {
    bookHelp
  }
}

export default connect(mapStateToProps)(BookHelp)
