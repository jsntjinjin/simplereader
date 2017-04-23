/*
 * description: the reducer for categoryList
 * author: 麦芽糖
 * time: 2017年04月10日15:26:38
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  isLoadingBasic: true,
  maleList: [],
  femaleList: [],
  categoryListV2: null
}

export default function categoryList(state = initialState, action) {
  switch (action.type) {
    case types.DISCOVER_CATEGORY_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingBasic: action.isLoadingBasic
      })
    case types.DISCOVER_CATEGORY_LIST:
      return Object.assign({}, state, {
        isLoadingBasic: action.isLoadingBasic,
        maleList: action.maleList,
        femaleList: action.femaleList
      })
    case types.DISCOVER_CATEGORY_LIST_V2:
      return Object.assign({}, state, {
        categoryListV2: action.categoryListV2
      })
    default:
      return state
  }
}