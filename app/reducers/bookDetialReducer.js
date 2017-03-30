/*
 * description: the reducer for bookDetial
 * author: 麦芽糖
 * time: 2017年03月18日14:21:55
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  isLoading: false,
  data: '',
  hotReview: [],
  recommendBookList: []
}

export default function bookDetial(state = initialState, action) {
  switch (action.type) {
    case types.BOOK_DETIAL_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      })
    case types.BOOK_DETIAL:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        data: action.data
      })
    case types.BOOK_HOT_REVIEW:
      return Object.assign({}, state, {
        hotReview: action.hotReview
      })
    case types.BOOK_RECOMMEND_BOOK_LIST:
      return Object.assign({}, state, {
        recommendBookList: action.recommendBookList
      })
    default:
      return state
  }
}