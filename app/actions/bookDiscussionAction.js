/*
 * description: the action for bookDiscussion/bookDiscussionDetail
 * author: 麦芽糖
 * time: 
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let bookDiscussionList = (params, isFirst, oldList) => {
  return dispatch => {
    dispatch(loadingBookDiscussionList(isFirst))
    return request.get(api.COMMUNITY_BOOK_DISCUSSION_LIST, params,
      (data) => {data.ok ? dispatch(getBookDiscussionListSuccess(data.posts, oldList)) : dispatch(getBookDiscussionListSuccess([], oldList))},
      (error) => {dispatch(getBookDiscussionListSuccess([], oldList))})
  }
}

export let bookDiscussionDetail = (id) => {
  return dispatch => {
    dispatch(loadingBookDiscussionDetail())
    return request.get(api.COMMUNITY_BOOK_DISCUSSION_DETAIL(id), null,
      (data) => {data.ok ? dispatch(getBookDiscussionDetailSuccess(data.post)) : dispatch(getBookDiscussionDetailSuccess(null))},
      (error) => {dispatch(getBookDiscussionDetailSuccess(null))})
  }
}

export let bookDiscussionDetailCommentBest = (id) => {
  return dispatch => {
    return request.get(api.COMMUNITY_BOOK_COMMENT_BEST(id), null,
      (data) => {data.ok ? dispatch(getBookDiscussionCommentBestSuccess(data.comments)) : dispatch(getBookDiscussionCommentBestSuccess([]))},
      (error) => {dispatch(getBookDiscussionCommentBestSuccess([]))})
  }
}

export let bookDiscussionDetailCommentList = (id, params, isFirst, oldList) => {
  return dispatch => {
    dispatch(loadingBookDiscussionComment(isFirst))
    return request.get(api.COMMUNITY_BOOK_DISCUSSION_COMMENT_LIST(id), params,
      (data) => {data.ok ? dispatch(getBookDiscussionCommentListSuccess(data.comments, oldList)) : dispatch(getBookDiscussionCommentListSuccess([], oldList))},
      (error) => {dispatch(getBookDiscussionCommentListSuccess([], oldList))})
  }
}

let getBookDiscussionListSuccess = (data, oldList) => {
  return {
    type: types.COMMUNITY_BOOK_DISCUSSION_LIST,
    isLoadingBookDiscussionList: false,
    isLoadingBookDiscussionListMore: false,
    bookDiscussionList: oldList.concat(data)
  }
}

let loadingBookDiscussionList = (isFirst) => {
  if (isFirst) {
    return {
      type: types.COMMUNITY_BOOK_DISCUSSION_LIST_LOADING,
      isLoadingBookDiscussionList: true,
    }
  } else {
    return {
      type: types.COMMUNITY_BOOK_DISCUSSION_LIST_LOADING,
      isLoadingBookDiscussionListMore: true,
    }
  }
}

let loadingBookDiscussionDetail = () => {
  return {
    type: types.COMMUNITY_BOOK_DISCUSSION_DETAIL_LOADING,
    isLoadingDetail: true,
  }
}

let getBookDiscussionDetailSuccess = (data) => {
  return {
    type: types.COMMUNITY_BOOK_DISCUSSION_DETAIL,
    isLoadingDetail: false,
    bookDiscussionDetail: data,
    totalComment: data.commentCount
  }
}

let getBookDiscussionCommentBestSuccess = (data) => {
  return {
    type: types.COMMUNITY_BOOK_DISCUSSION_DETAIL_COMMENT_BEST,
    bookDiscussionDetailCommentBest: data
  }
}

let loadingBookDiscussionComment = (isFirst) => {
  if (isFirst) {
    return {
      type: types.COMMUNITY_BOOK_DISCUSSION_DETAIL_COMMENT_LIST_LOADING,
      isLoadingBookDiscussionCommentList: true,
    }
  } else {
    return {
      type: types.COMMUNITY_BOOK_DISCUSSION_DETAIL_COMMENT_LIST_LOADING,
      isLoadingBookDiscussionCommentListMore: true,
    }
  }
}

let getBookDiscussionCommentListSuccess = (data, oldList) => {
  return {
    type: types.COMMUNITY_BOOK_DISCUSSION_DETAIL_COMMENT_LIST,
    isLoadingBookDiscussionCommentList: false,
    isLoadingBookDiscussionCommentListMore: false,
    bookDiscussionCommentList: oldList.concat(data)
  }
}
