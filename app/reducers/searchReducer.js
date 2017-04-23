/*
 * description: the reducer for search
 * author: 麦芽糖
 * time: 2017年04月22日00:01:03
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  hotPart: 0,
  hotWords: [],
  hotWordsPart: [],
  autoComplete: [],
  searchData: [],
  searchState: false,
}

export default function readPlatform(state = initialState, action) {
  switch (action.type) {
    case types.SEARCH_HOT_WORDS:
      return Object.assign({}, state, {
        hotWords: action.hotWords
      })
    case types.SEARCH_REFRESH_HOT_WORDS:
      return Object.assign({}, state, {
        hotWordsPart: action.hotWordsPart,
        hotPart: action.hotPart
      })
    case types.SEARCH_AUTO_COMPLETE:
      return Object.assign({}, state, {
        autoComplete: action.autoComplete
      })
    case types.SEARCH_SEARCH_BOOKS:
      return Object.assign({}, state, {
        searchData: action.searchData,
        searchState: action.searchState,
        autoComplete: action.autoComplete
      })
    case types.SEARCH_BACK_TO_INIT_STATE:
      return Object.assign({}, state, {
        searchState: action.searchState, 
        autoComplete: action.autoComplete
      })
    default:
      return state
  }
}
