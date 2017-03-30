/*
 * description: 网络请求工具类
 * author: 麦芽糖
 * time: 2017年03月12日19:23:15
 */

'use strict'

import queryString from 'query-string'
import _ from 'lodash'
import Mock from 'mockjs'
import config from '../common/config'

var request = {}

request.get = (url, params) => {
  if (params) {
    url += '?' + queryString.stringify(params)
  }
  console.log('httpUtil -- GET -- URL : ' + url)
  return fetch(url)
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      return response
    })
}

request.post = (url, body) => {
  var options = _.extend(config.header, {
    body: JSON.stringify(body)
  })
  console.log('httpUtil -- POST -- URL : ' + url + ' -- BODY : ' + body )
  return fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response)
      return response
    })
}
module.exports = request