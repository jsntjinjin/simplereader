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
    return request.get(api.DISCOVER_BOOK_LIST, params)
      .then((data) => {
        if (data.ok) {
          dispatch(getBookListSuccess(data, isFirst, oldBookList))
        } else {
          dispatch(getBookListSuccess(null))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(getBookListSuccess(null))
      })
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
