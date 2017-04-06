/*
 * description: 排行榜
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

import ChartsDetail from './chartsDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import {charts} from '../../actions/chartsAction'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class Charts extends Component {

  constructor(props) {
    
    super(props)
    this.state = {
      showMaleOther: false,
      showFemaleOther: false
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(charts())
  }

  _back() {
    this.props.navigator.pop()
  }

  _showMaleCollapse() {
    this.setState({showMaleOther : !this.state.showMaleOther})
  }

  _showFemaleCollapse() {
    this.setState({showFemaleOther : !this.state.showFemaleOther})
  }

  _goToChartsDetail(rowData) {
      this.props.navigator.push({
        name: 'chartsDetail',
        component: ChartsDetail,
        params: {
          chartsItem: rowData
        }
      })
  }
 
  renderMainItem(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.cover 
              ? {uri: (api.IMG_BASE_URL + rowData.cover)} 
              : require('../../imgs/ic_rank_collapse.png')}
            />
          <Text style={styles.itemTitle}>{rowData.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderOtherItem(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData)}>
        <Text style={styles.itemOtherTitle}>{rowData.title}</Text>
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
          <Text style={styles.headerText}>排行榜</Text>
          <Icon 
            name='ios-cloud-download-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appMainColor}/>
        </View>
        {charts.isLoading ? 
            <Text style={[styles.body]}>正在加载中~~~</Text>
          :
            <ScrollView 
              style={styles.body}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.listHeader}>男生</Text>
              <ListView 
                enableEmptySections={true}
                dataSource={ds.cloneWithRows(charts.male)}
                renderRow={this.renderMainItem.bind(this)}/>
              <TouchableOpacity 
                activeOpacity={0.5}
                onPress={() => this._showMaleCollapse()}>
                <View style={styles.item}>
                  <Image 
                    style={styles.itemImage}
                    source={require('../../imgs/ic_rank_collapse.png')}
                    />
                  <Text style={styles.itemTitle}>更多排行榜</Text>
                </View>
              </TouchableOpacity>
              {this.state.showMaleOther ?
                <ListView 
                  enableEmptySections={true}
                  dataSource={ds.cloneWithRows(charts.maleOther)}
                  renderRow={this.renderOtherItem.bind(this)}/>
                :
                null
              }
              <Text style={styles.listHeader}>女生</Text>
              <ListView 
                enableEmptySections={true}
                dataSource={ds.cloneWithRows(charts.female)}
                renderRow={this.renderMainItem.bind(this)}/>
              <TouchableOpacity 
                activeOpacity={0.5}
                onPress={() => this._showFemaleCollapse()}>
                <View style={styles.item}>
                  <Image 
                    style={styles.itemImage}
                    source={require('../../imgs/ic_rank_collapse.png')}
                    />
                  <Text style={styles.itemTitle}>更多排行榜</Text>
                </View>
              </TouchableOpacity>
              {this.state.showFemaleOther ?
                <ListView 
                  enableEmptySections={true}
                  dataSource={ds.cloneWithRows(charts.femaleOther)}
                  renderRow={this.renderOtherItem.bind(this)}/>
                :
                null
              }
            </ScrollView>
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
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
  },
  item: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    alignSelf: 'center',
    width: 30,
    height: 30
  },
  itemTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    marginBottom: 3
  },
  itemOtherTitle: {
    marginLeft: 40,
    height: 30
  }
})

function mapStateToProps(store) {
  const { charts } = store
  return {
    charts
  }
}

export default connect(mapStateToProps)(Charts)