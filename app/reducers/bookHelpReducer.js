/*
 * description: the reducer for bookHelp/bookHelpDetail
 * author: 麦芽糖
 * time: 2017年04月14日15:55:10
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  isLoadingBookHelpList: false,
  isLoadingBookHelpListMore: false,
  bookHelpList: [],

  isLoadingDetail: false,
  bookHelpDetail: null,
  totalComment: 0,
  bookHelpDetailCommentBest: [],
  isLoadingBookHelpCommentList: false,
  isLoadingBookHelpCommentListMore: false,
  bookHelpCommentList: []
}

export default function bookHelp(state = initialState, action) {
  switch (action.type) {
    case types.COMMUNITY_BOOK_HELP_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingBookHelpList: action.isLoadingBookHelpList
      })
    case types.COMMUNITY_BOOK_HELP_LIST:
      return Object.assign({}, state, {
        isLoadingBookHelpList: action.isLoadingBookHelpList,
        bookHelpList: action.bookHelpList
      })
    case types.COMMUNITY_BOOK_HELP_DETAIL_LOADING:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail,
      })
    case types.COMMUNITY_BOOK_HELP_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail,
        bookHelpDetail: action.bookHelpDetail,
        totalComment: action.totalComment
      })
    case types.COMMUNITY_BOOK_HELP_DETAIL_COMMENT_BEST:
      return Object.assign({}, state, {
        bookHelpDetailCommentBest: action.bookHelpDetailCommentBest
      })
    case types.COMMUNITY_BOOK_HELP_DETAIL_COMMENT_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingBookHelpCommentList: action.isLoadingBookHelpCommentList
      })
    case types.COMMUNITY_BOOK_HELP_DETAIL_COMMENT_LIST:
      return Object.assign({}, state, {
        isLoadingBookHelpCommentList: action.isLoadingBookHelpCommentList,
        isLoadingBookHelpCommentListMore: action.isLoadingBookHelpCommentListMore,
        bookHelpCommentList: action.bookHelpCommentList
      })
    default:
      return state
  }
}
