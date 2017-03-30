/*
 * description: all of reducer to combine
 * author: 麦芽糖
 * time: 2017年03月18日14:28:04
 */

'use strict'

import {combineReducers} from 'redux'
import readPlatform from './readPlatformReducer'

const rootReducer = combineReducers({
  readPlatform
})

export default rootReducer