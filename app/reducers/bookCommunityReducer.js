/*
 * description: the reducer for bookDiscussionTab/bookReviewTab
 * author: 麦芽糖
 * time: 2017年04月19日15:43:41
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  isLoadingDiscussion: false,
  isLoadingDiscussionMore: false,
  bookDiscussionList: [],

  isLoadingReview: false,
  isLoadingReviewMore: false,
  bookReviewList: [],
  bookReviewTotal: 0
}

export default function bookDetail(state = initialState, action) {
  switch (action.type) {
    case types.BOOK_DISCUSSION_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingDiscussion: action.isLoadingDiscussion
      })
    case types.BOOK_DISCUSSION_LIST:
      return Object.assign({}, state, {
        isLoadingDiscussion: action.isLoadingDiscussion,
        isLoadingDiscussionMore: action.isLoadingDiscussionMore,
        bookDiscussionList: action.bookDiscussionList,
      })
    case types.BOOK_REVIEW_LIST_LOADING:
      return Object.assign({}, state, {
        isLoadingReview: action.isLoadingReview
      })
    case types.BOOK_REVIEW_LIST:
      return Object.assign({}, state, {
        isLoadingReview: action.isLoadingReview,
        isLoadingReviewMore: action.isLoadingReviewMore,
        bookReviewList: action.bookReviewList,
        bookReviewTotal: action.bookReviewTotal
      })
    default:
      return state
  }
}
