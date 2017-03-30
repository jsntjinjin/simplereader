/*
 * description: the reducer for readPlatform
 * author: 麦芽糖
 * time: 2017年03月20日15:56:16
 */

'use strict'

import * as types from '../common/actionType'

const initialState = {
  bookChapter: null,
  chapterDetial: null,
  chapterNum: 0
}

export default function readPlatform(state = initialState, action) {
  switch (action.type) {
    case types.READ_BOOK_CHAPTER_LIST:
      return Object.assign({}, state, {
        bookChapter: action.mixToc
      })
    case types.READ_BOOK_CHAPTER_DETIAL:
      return Object.assign({}, state, {
        chapterDetial: action.chapterDetial,
        chapterNum: action.chapterNum
      })
    // case types.BOOK_HOT_REVIEW:
    //   return Object.assign({}, state, {

    //   })
    // case types.BOOK_RECOMMEND_BOOK_LIST:
    //   return Object.assign({}, state, {

    //   })
    default:
      return state
  }
}