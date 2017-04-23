/*
 * description: the action for bookList, bookListDetail
 * author: 麦芽糖
 * time: 2017年04月06日22:56:27
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let bookListData = (params, isFirst, oldBookList) => {
  return dispatch => {
    dispatch(loadingBookList(isFirst))
    return request.get(api.DISCOVER_BOOK_LIST, params,
      (data) => {data.ok ? dispatch(getBookListSuccess(data, isFirst, oldBookList)) : dispatch(getBookListSuccess(null))},
      (error) => {dispatch(getBookListSuccess(null))})
  }
}

let loadingBookList = (isFirst) => {
  if (isFirst) {
    return {
      type: types.DISCOVER_BOOK_LIST_LOADING,
      isLoading: true
    }
  } else {
    return {
      type: types.DISCOVER_BOOK_LIST_LOADING,
      isLoadingMore: true
    }
  }
}

let getBookListSuccess = (bookList, isFirst, oldBookList) => {
  return {
    type: types.DISCOVER_BOOK_LIST,
    isLoading: false,
    isLoadingMore: false,
    total: bookList.total,
    bookLists: oldBookList.concat(bookList.bookLists),
    isFirst: isFirst
  }
}
