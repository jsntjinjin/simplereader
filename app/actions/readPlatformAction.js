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
    return request.get(api.READ_BOOK_CHAPTER_LIST(id), null,
      (data) => {
        if(data.ok) {
          dispatch(getBookChapterSuccess(data.mixToc))
          dispatch(chapterDetailFromNet(data.mixToc.chapters[num].link, num))
        } else {
          dispatch(getBookChapterSuccess(null))
        }
      },
      (error) => {dispatch(getBookChapterSuccess(null))})
  }
}

export let chapterDetailFromNet = (chapterUrl, chapterNum) => {
  let tempUrl = chapterUrl.replace(/\//g, '%2F').replace('?', '%3F')
  return dispatch => {
    return request.get(api.READ_BOOK_CHAPTER_DETAIL(tempUrl), null,
      (data) => {data.ok ? dispatch(getChapterDetailSuccess(data.chapter, chapterNum)) : dispatch(getChapterDetailFailure(chapterNum))},
      (error) => {dispatch(getChapterDetailFailure(chapterNum))})
  }
}

let getBookChapterSuccess = (mixToc) => {
  return {
    type: types.READ_BOOK_CHAPTER_LIST,
    mixToc: mixToc
  }
}

let getChapterDetailSuccess = (chapterDetail, chapterNum) => {
  chapterDetail.body = '        ' + chapterDetail.body.replace(/\n/g, '\n        ')
  return {
    type: types.READ_BOOK_CHAPTER_DETAIL,
    chapterDetail: chapterDetail,
    chapterNum: chapterNum
  }
}

let getChapterDetailFailure = (chapterNum) => {
  return {
    type: types.READ_BOOK_CHAPTER_DETAIL,
    chapterDetail: null,
    chapterNum: chapterNum
  }
}