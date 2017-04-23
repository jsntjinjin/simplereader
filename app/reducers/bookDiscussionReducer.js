/*
 * description: the reducer for bookDiscussion/bookDiscussionDetail
 * author: 麦芽糖
 * time: 2017年04月12日14:12:04
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  isLoadingBookDiscussionList: false,
  isLoadingBookDiscussionListMore: false,
  bookDiscussionList: [],

  isLoadingDetail: false,
  bookDiscussionDetail: null,
  bookDiscussionDetailCommentBest: [],
  isLoadingBookDiscussionCommentList: false,
  isLoadingBookDiscussionCommentListMore: false,
  bookDiscussionCommentList: [],
  totalComment: 0
}

export default function bookDiscussion(state = initialState, action) {
  switch (action.type) {
    case types.COMMUNITY_BOOK_DISCUSSION_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingBookDiscussionList: action.isLoadingBookDiscussionList
      })
    case types.COMMUNITY_BOOK_DISCUSSION_LIST:
      return Object.assign({}, state, {
        isLoadingBookDiscussionList: action.isLoadingBookDiscussionList,
        bookDiscussionList: action.bookDiscussionList
      })
    case types.COMMUNITY_BOOK_DISCUSSION_DETAIL_LOADING:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail,
      })
    case types.COMMUNITY_BOOK_DISCUSSION_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail,
        bookDiscussionDetail: action.bookDiscussionDetail,
        totalComment: action.totalComment
      })
    case types.COMMUNITY_BOOK_DISCUSSION_DETAIL_COMMENT_BEST:
      return Object.assign({}, state, {
        bookDiscussionDetailCommentBest: action.bookDiscussionDetailCommentBest
      })
    case types.COMMUNITY_BOOK_DISCUSSION_DETAIL_COMMENT_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingBookDiscussionCommentList: action.isLoadingBookDiscussionCommentList
      })
    case types.COMMUNITY_BOOK_DISCUSSION_DETAIL_COMMENT_LIST:
      return Object.assign({}, state, {
        isLoadingBookDiscussionCommentList: action.isLoadingBookDiscussionCommentList,
        isLoadingBookDiscussionCommentListMore: action.isLoadingBookDiscussionCommentListMore,
        bookDiscussionCommentList: action.bookDiscussionCommentList
      })
    default:
      return state
  }
}