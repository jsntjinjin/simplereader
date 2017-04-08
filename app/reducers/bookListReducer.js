/*
 * description: the reducer for bookList, bookListDetail
 * author: 麦芽糖
 * time: 2017年04月07日10:37:53
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  isLoading: false,
  isLoadingMore: false,
  bookLists: [],
  total: 0,
  isLoadingDetail: false,
}

export default function charts(state = initialState, action) {
  switch (action.type) {
    case types.DISCOVER_BOOK_LIST_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      })
    case types.DISCOVER_BOOK_LIST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        isLoadingMore: action.isLoadingMore,
        total: action.total,
        bookLists: action.bookLists
      })
    case types.DISCOVER_BOOK_LIST_DETAIL_LOADING:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail
      })
    case types.DISCOVER_BOOK_LIST_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail,
      })
    default:
      return state
  }
}