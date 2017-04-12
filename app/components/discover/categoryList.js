/*
 * description: 分类页面
 * author: 麦芽糖
 * time: 2017年04月05日16:10:56
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

import CategoryDetail from './categoryDetail'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import {categoryListBasic, categoryListV2} from '../../actions/categoryListAction'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class CategoryList extends Component {

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(categoryListBasic())
    dispatch(categoryListV2())
  }

  _back() {
    this.props.navigator.pop()
  }

  _goToCategoryDetail(isMale, name) {
    if (name) {
      let categorylistSelected = this._getSelectedCategoryList(isMale, name)
      this.props.navigator.push({
        name: 'categoryDetail',
        component: CategoryDetail,
        params: {
          categoryListSelected: categorylistSelected ? categorylistSelected : {major: name, mins: []},
          gender: isMale ? 'male' : 'female',
          major: name,
          minor: ''
        }
      })
    }
  }

  _getSelectedCategoryList(isMale, name) {
    let categorylistSelected = null 
    const {categoryList} = this.props
    if (categoryList.categoryListV2 && isMale) {
      categoryList.categoryListV2.male.forEach(function(element) {
        if (name === element.major) {
          categorylistSelected =  element
        }
      }, this);
    } else if (categoryList.categoryListV2 && !isMale){
      categoryList.categoryListV2.female.forEach(function(element) {
        if (name === element.major) {
          categorylistSelected =  element
        }
      }, this);
    }
    return categorylistSelected
  }
 
  renderCategoryListMale(rowData) {
    return (
      <TouchableOpacity 
        style={styles.item}
        activeOpacity={0.5}
        onPress={() => this._goToCategoryDetail(true, rowData.name)}>
        <View>
          <Text style={styles.itemTitle}>{rowData.name}</Text>
          <Text style={styles.itemDesc}>{rowData.bookCount}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderCategoryListFemale(rowData) {
    return (
      <TouchableOpacity 
        style={styles.item}
        activeOpacity={0.5}
        onPress={() => this._goToCategoryDetail(false, rowData.name)}>
        <View>
          <Text style={styles.itemTitle}>{rowData.name}</Text>
          <Text style={styles.itemDesc}>{rowData.bookCount}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {categoryList} = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon 
            name='ios-arrow-back-outline'
            style= {styles.headerIcon}
            size={25}
            color={config.css.color.appBlack}
            onPress={this._back.bind(this)}/>
          <Text style={styles.headerText}>分类</Text>
        </View>
        {categoryList.isLoadingBasic ?
            <Text>正在加载中~~~</Text>
          :
            <ScrollView style={styles.body}>
              <Text style={styles.listHeader}>男生</Text>
              <ListView
                dataSource={ds.cloneWithRows(categoryList.maleList)}
                renderRow={this.renderCategoryListMale.bind(this)}
                enableEmptySections={true}
                initialListSize={categoryList.maleList.length}
                removeClippedSubviews={false}
                contentContainerStyle={styles.listStyle}
                showsVerticalScrollIndicator={false}/>
              <Text style={styles.listHeader}>女生</Text>
              <ListView
                dataSource={ds.cloneWithRows(categoryList.femaleList)}
                renderRow={this.renderCategoryListFemale.bind(this)}
                enableEmptySections={true}
                initialListSize={categoryList.femaleList.length}
                removeClippedSubviews={false}
                contentContainerStyle={styles.listStyle}
                showsVerticalScrollIndicator={false}/>
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
    width: Dimen.window.width / 3 - 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0.5,
    backgroundColor: config.css.color.white
  },
  itemTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    alignSelf: 'center'
  },
  itemDesc: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginTop: 3,
    alignSelf: 'center'
  }
})

function mapStateToProps(store) {
  const { categoryList } = store
  return {
    categoryList
  }
}

export default connect(mapStateToProps)(CategoryList)