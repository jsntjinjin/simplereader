/*
 * description: the action for bookHelp/bookHelpDetail
 * author: 麦芽糖
 * time: 2017年04月16日22:57:07
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let bookHelpList = (params, isFirst, oldList) => {
  return dispatch => {
    dispatch(loadingBookHelpList(isFirst))
    return request.get(api.COMMUNITY_BOOK_HELP_LIST, params,
      (data) => {data.ok ? dispatch(getBookHelpListSuccess(data.helps, oldList)) : dispatch(getBookHelpListSuccess([], oldList))},
      (error) => {dispatch(getBookHelpListSuccess([], oldList))})
  }
}

export let bookHelpDetail = (id) => {
  return dispatch => {
    dispatch(loadingBookHelpDetail())
    return request.get(api.COMMUNITY_BOOK_HELP_DETAIL(id), null,
      (data) => {data.ok ? dispatch(getBookHelpDetailSuccess(data.help)) : dispatch(getBookHelpDetailSuccess(null))},
      (error) => {dispatch(getBookHelpDetailSuccess(null))})
  }
}

export let bookHelpDetailCommentList = (id, params, isFirst, oldList) => {
  return dispatch => {
    dispatch(loadingBookHelpComment(isFirst))
    return request.get(api.COMMUNITY_BOOK_REVIEW_COMMENT_LIST(id), params,
      (data) => {data.ok ? dispatch(getBookHelpCommentListSuccess(data.comments, oldList)) : dispatch(getBookHelpCommentListSuccess(null))},
      (error) => {dispatch(getBookHelpCommentListSuccess(null))})
  }
}

export let bookHelpDetailCommentBest = (id) => {
  return dispatch => {
    return request.get(api.COMMUNITY_BOOK_COMMENT_BEST(id), null,
      (data) => {data.ok ? dispatch(getBookHelpCommentBestSuccess(data.comments)) : dispatch(getBookHelpCommentBestSuccess([]))},
      (error) => {dispatch(getBookHelpCommentBestSuccess([]))})
  }
}

let getBookHelpListSuccess = (data, oldList) => {
  return {
    type: types.COMMUNITY_BOOK_HELP_LIST,
    isLoadingBookHelpList: false,
    isLoadingBookHelpListMore: false,
    bookHelpList: oldList.concat(data)
  }
}

let loadingBookHelpList = (isFirst) => {
  if (isFirst) {
    return {
      type: types.COMMUNITY_BOOK_HELP_LIST_LOADING,
      isLoadingBookHelpList: true,
    }
  } else {
    return {
      type: types.COMMUNITY_BOOK_HELP_LIST_LOADING,
      isLoadingBookHelpListMore: true,
    }
  }
}

let loadingBookHelpDetail = () => {
  return {
    type: types.COMMUNITY_BOOK_HELP_DETAIL_LOADING,
    isLoadingDetail: true,
  }
}

let getBookHelpDetailSuccess = (data) => {
  return {
    type: types.COMMUNITY_BOOK_HELP_DETAIL,
    isLoadingDetail: false,
    bookHelpDetail: data,
    totalComment: data.commentCount
  }
}

let getBookHelpCommentBestSuccess = (data) => {
  return {
    type: types.COMMUNITY_BOOK_HELP_DETAIL_COMMENT_BEST,
    bookHelpDetailCommentBest: data
  }
}

let loadingBookHelpComment = (isFirst) => {
  if (isFirst) {
    return {
      type: types.COMMUNITY_BOOK_HELP_DETAIL_COMMENT_LIST_LOADING,
      isLoadingBookHelpCommentList: true,
    }
  } else {
    return {
      type: types.COMMUNITY_BOOK_HELP_DETAIL_COMMENT_LIST_LOADING,
      isLoadingBookHelpCommentListMore: true,
    }
  }
}

let getBookHelpCommentListSuccess = (data, oldList) => {
  return {
    type: types.COMMUNITY_BOOK_HELP_DETAIL_COMMENT_LIST,
    isLoadingBookHelpCommentList: false,
    isLoadingBookHelpCommentListMore: false,
    bookHelpCommentList: oldList.concat(data)
  }
}

