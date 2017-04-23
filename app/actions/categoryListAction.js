/*
 * description: the action for categoryList
 * author: 麦芽糖
 * time: 2017年04月10日15:17:27
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let categoryListBasic = () => {
  return dispatch => {
    dispatch(loadingCategoryListBasic())
    return request.get(api.DISCOVER_CATEGORY_LIST, null,
      (data) => {data.ok ? dispatch(getCategoryListBasicSuccess(data)) : dispatch(getCategoryListBasicSuccess(null))},
      (error) => {dispatch(getCategoryListBasicSuccess(null))})
  }
}

export let categoryListV2 = () => {
  return dispatch => {
    return request.get(api.DISCOVER_CATEGORY_LIST_V2, null,
      (data) => {data.ok ? dispatch(getCategoryListV2Success(data)) : dispatch(getCategoryListV2Success(null))},
      (error) => {dispatch(getCategoryListV2Success(null))})
  }
}

let addEmptyModel = (array) => {
  switch (array.length % 3) {
    case 0:
      return array
    case 1:
      array.push({bookCount: '', name: ''}, {bookCount: '', name: ''})
      return array
    case 2:
      array.push({bookCount: '', name: ''})
      return array
  }
}

let getCategoryListBasicSuccess = (data) => {
  let male = addEmptyModel(data.male)
  let female = addEmptyModel(data.female)
  return {
    type: types.DISCOVER_CATEGORY_LIST,
    isLoadingBasic: false,
    maleList: male,
    femaleList: female
  }
}

let loadingCategoryListBasic = () => {
  return {
    type: types.DISCOVER_CATEGORY_LIST_LOADING,
    isLoadingBasic: true
  }
}

let getCategoryListV2Success = (data) => {
  return {
    type: types.DISCOVER_CATEGORY_LIST_V2,
    categoryListV2: data
  }
}

