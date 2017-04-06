/*
 * description: the actions for bookDetail
 * author: 麦芽糖
 * time: 2017年03月18日14:02:11
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let bookDetail = (id) => {
  return dispatch => {
    dispatch(loadingBookDetail())
    return request.get(api.BOOK_DETAIL(id), null)
      .then((data) => {
        dispatch(getBookDetailSuccess(data))
      })
      .catch((err) => {
        console.log(err)
        dispatch(getBookDetailSuccess(null))
      })
  }
}

export let hotReview = (id) => {
  return dispatch => {
    return request.get(api.BOOK_HOT_REVIEW, {book: id})
      .then((data) => {
        if(data.ok){
          dispatch(getHotReviewSuccess(data.reviews))
        } else {
          dispatch(getHotReviewSuccess([]))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(getHotReviewSuccess([]))
      })
  }
}

export let recommendBookList = (id, limit) => {
  return dispatch => {
    return request.get(api.BOOK_RECOMMEND_BOOK_LIST(id), {limit: limit})
      .then((data) => {
        if(data.ok){
          dispatch(getRecommendBookListSuccess(data.booklists))
        } else {
          dispatch(getRecommendBookListSuccess([]))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(getRecommendBookListSuccess([]))
      })
  }
}

let getBookDetailSuccess = (data) => {
  return {
    type: types.BOOK_DETAIL,
    isLoading: false,
    data: data
  }
}

let loadingBookDetail = () => {
  return {
    type: types.BOOK_DETAIL_LOADING,
    isLoading: true
  }
}

let getHotReviewSuccess = (data) => {
  return {
    type: types.BOOK_HOT_REVIEW,
    hotReview: data
  }
}

let getRecommendBookListSuccess = (data) => {
  return {
    type: types.BOOK_RECOMMEND_BOOK_LIST,
    recommendBookList: data
  }
}