/*
 * description: the reducer for bookReview/bookReviewDetail
 * author: 麦芽糖
 * time: 2017年04月14日15:55:10
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  isLoadingBookReviewList: false,
  isLoadingBookReviewListMore: false,
  bookReviewList: [],

  isLoadingDetail: false,
  bookReviewDetail: null,
  totalComment: 0,
  bookReviewDetailCommentBest: [],
  isLoadingBookReviewCommentList: false,
  isLoadingBookReviewCommentListMore: false,
  bookReviewCommentList: []
}

export default function bookDetail(state = initialState, action) {
  switch (action.type) {
    case types.COMMUNITY_BOOK_REVIEW_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingBookReviewList: action.isLoadingBookReviewList
      })
    case types.COMMUNITY_BOOK_REVIEW_LIST:
      return Object.assign({}, state, {
        isLoadingBookReviewList: action.isLoadingBookReviewList,
        bookReviewList: action.bookReviewList
      })
    case types.COMMUNITY_BOOK_REVIEW_DETAIL_LOADING:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail,
      })
    case types.COMMUNITY_BOOK_REVIEW_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.isLoadingDetail,
        bookReviewDetail: action.bookReviewDetail,
        totalComment: action.totalComment
      })
    case types.COMMUNITY_BOOK_REVIEW_DETAIL_COMMENT_BEST:
      return Object.assign({}, state, {
        bookReviewDetailCommentBest: action.bookReviewDetailCommentBest
      })
    case types.COMMUNITY_BOOK_REVIEW_DETAIL_COMMENT_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingBookReviewCommentList: action.isLoadingBookReviewCommentList
      })
    case types.COMMUNITY_BOOK_REVIEW_DETAIL_COMMENT_LIST:
      return Object.assign({}, state, {
        isLoadingBookReviewCommentList: action.isLoadingBookReviewCommentList,
        isLoadingBookReviewCommentListMore: action.isLoadingBookReviewCommentListMore,
        bookReviewCommentList: action.bookReviewCommentList
      })
    default:
      return state
  }
}
