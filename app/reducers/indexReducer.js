/*
 * description: all of reducer to combine
 * author: 麦芽糖
 * time: 2017年03月18日14:28:04
 */

'use strict'

import {combineReducers} from 'redux'
import readPlatform from './readPlatformReducer'
import charts from './chartsReducer'
import bookList from './bookListReducer'
import categoryList from './categoryListReducer'
import bookDiscussion from './bookDiscussionReducer'
import bookReview from './bookReviewReducer'
import bookHelp from './bookHelpReducer'

const rootReducer = combineReducers({
  readPlatform,
  charts,
  bookList,
  categoryList,
  bookDiscussion,
  bookReview,
  bookHelp
})

export default rootReducer