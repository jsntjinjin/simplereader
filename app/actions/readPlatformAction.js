/*
 * description: the action for readPlatform
 * author: 麦芽糖
 * time: 2017年03月20日15:55:29
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let bookChapter = (id, num) => {
  return dispatch => {
    return request.get(api.READ_BOOK_CHAPTER_LIST(id), null)
      .then((data) => {
        if(data.ok) {
          dispatch(getBookChapterSuccess(data.mixToc))
          dispatch(chapterDetialFromNet(data.mixToc.chapters[num].link, num))
        } else {
          dispatch(getBookChapterSuccess(null))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(getBookChapterSuccess(null))
      })
  }
}

export let chapterDetialFromNet = (chapterUrl, chapterNum) => {
  return dispatch => {
    return request.get(api.READ_BOOK_CHAPTER_DETIAL(chapterUrl), null)
      .then((data) => {
        if(data.ok) {
          dispatch(getChapterDetialSuccess(data.chapter, chapterNum))
        } else {
          dispatch(getChapterDetialSuccess(null, chapterNum))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(getChapterDetialSuccess(null, chapterNum))
      })
  }
}

let getBookChapterSuccess = (mixToc) => {
  return {
    type: types.READ_BOOK_CHAPTER_LIST,
    mixToc: mixToc
  }
}

let getChapterDetialSuccess = (chapterDetial, chapterNum) => {
  chapterDetial.body = '        ' + chapterDetial.body.replace(/\n/g, '\n        ')
  return {
    type: types.READ_BOOK_CHAPTER_DETIAL,
    chapterDetial: chapterDetial,
    chapterNum: chapterNum
  }
}