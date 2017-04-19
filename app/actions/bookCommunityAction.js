/*
 * description: the action for bookDiscussionTab/bookReviewTab
 * author: 麦芽糖
 * time: 2017年04月19日15:31:46
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let bookDiscussionList = (params, isFirst, oldList) => {
  return dispatch => {
    dispatch(loadingBookDiscussionList(isFirst))
    return request.get(api.BOOK_DISCUSSION_LIST, params)
      .then((data) => {
        if (data.ok) {
          dispatch(getBookDiscussionListSuccess(data.posts, oldList))
        } else {
           dispatch(getBookDiscussionListSuccess([], oldList))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(getBookDiscussionListSuccess([], oldList))
      })
  }
}

export let bookReviewList = (params, isFirst, oldList) => {
  return dispatch => {
    dispatch(loadingBookReviewList(isFirst))
    return request.get(api.BOOK_REVIEW_LIST, params)
      .then((data) => {
        if (data.ok) {
          dispatch(getBookReviewListSuccess(data.reviews, oldList, data.total))
        } else {
           dispatch(getBookReviewListSuccess([], oldList))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(getBookReviewListSuccess([], oldList))
      })
  }
}

let getBookDiscussionListSuccess = (data, oldList) => {
  return {
    type: types.BOOK_DISCUSSION_LIST,
    isLoadingDiscussion: false,
    isLoadingDiscussionMore: false,
    bookDiscussionList: oldList.concat(data)
  }
}

let loadingBookDiscussionList = (isFirst) => {
  if (isFirst) {
    return {
      type: types.BOOK_DISCUSSION_LIST_LOADING,
      isLoadingDiscussion: true
    }
  } else {
    return {
      type: types.BOOK_DISCUSSION_LIST_LOADING,
      isLoadingDiscussionMore: true
    }
  }
}

let getBookReviewListSuccess = (data, oldList, total) => {
  return {
    type: types.BOOK_REVIEW_LIST,
    isLoadingReview: false,
    isLoadingReviewMore: false,
    bookReviewList: oldList.concat(data),
    bookReviewTotal: total
  }
}

let loadingBookReviewList = (isFirst) => {
  if (isFirst) {
    return {
      type: types.BOOK_REVIEW_LIST_LOADING,
      isLoadingReview: true
    }
  } else {
    return {
      type: types.BOOK_REVIEW_LIST_LOADING,
      isLoadingReviewMore: true
    }
  }
}
