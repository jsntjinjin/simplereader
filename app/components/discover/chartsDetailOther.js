/*
 * description: 单个榜单详情(其他)
 * author: 麦芽糖
 * time: 2017年04月06日11:56:52
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

import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import {chartsDetail} from '../../actions/chartsAction'
import BookDetail from '../bookDetail'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class ChartsDetailOther extends Component {

  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(chartsDetail(this.props.chartsItem._id))
  }

  _back() {
    this.props.navigator.pop()
  }

  /**
   * 跳转书籍详情
   * @param {string} bookId 书籍id
   */
  _goToChartsDetail(bookId) {
      this.props.navigator.push({
        name: 'bookDetail',
        component: BookDetail,
        params: {
          bookId: bookId
        }
      })
  }

  renderMainItem(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData._id)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.cover 
              ? {uri: (api.IMG_BASE_URL + rowData.cover)} 
              : require('../../imgs/splash.jpg')}
            />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <Text style={styles.itemDesc}>{rowData.author + ' | ' + rowData.cat}</Text>
            <Text style={styles.itemDesc} numberOfLines={1}>{rowData.shortIntro}</Text>
            <Text style={styles.itemDesc}>{
              rowData.latelyFollower + '在追 | ' + rowData.retentionRatio + '%读者留存'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
 
  render() {
    const {charts} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>{this.props.chartsItem.title}</Text>
          <Icon 
            name='ios-cloud-download-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appMainColor}/>
        </View>
        {charts.isLoadingDetail ? 
            <Text style={[styles.body]}>正在加载中~~~</Text>
          :
            <ListView 
              enableEmptySections={true}
              style={styles.body}
              dataSource={ds.cloneWithRows(charts.chartsDetailBooks)}
              renderRow={this.renderMainItem.bind(this)}/>
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
  item: {
    flexDirection: 'row',
    height: 100,
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
    marginTop: 3,
    marginRight: 14
  }
})

function mapStateToProps(store) {
  const { charts } = store
  return {
    charts
  }
}

export default connect(mapStateToProps)(ChartsDetailOther)