/*
 * description: store
 * author: 麦芽糖
 * time: 2017年03月18日14:31:13
 */

import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers/indexReducer'

const logger = createLogger()

let store = createStore(
  rootReducer, 
  {}, 
  compose(applyMiddleware(thunkMiddleware, logger),
  window.devToolsExtension ? window.devToolsExtension() : f => f
))

export default store