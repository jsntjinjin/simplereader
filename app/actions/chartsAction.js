/*
 * description: the action for charts, chartsDetail
 * author: 麦芽糖
 * time: 2017年04月05日21:02:12
 */

'use strict'

import * as types from '../common/actionType'
import request from '../utils/httpUtil'
import api from '../common/api'

export let charts = () => {
  return dispatch => {
    dispatch(loadingCharts())
    return request.get(api.DISCOVER_CHARTS, null,
      (data) => {data.ok ? dispatch(getChartsSuccess(data)) : dispatch(getChartsSuccess(null))},
      (error) => {dispatch(getChartsSuccess(null))})
  }
}

export let chartsDetail = (id) => {
  return dispatch => {
    dispatch(loadingChartsDetail())
    return request.get(api.DISCOVER_CHARTS_DETAIL(id), null,
      (data) => {data.ok ? dispatch(getChartsDetailSuccess(data.ranking)) : dispatch(getChartsDetailSuccess(null))},
      (error) => {dispatch(getChartsDetailSuccess(null))})
  }
}

let loadingCharts = () => {
  return {
    type: types.DISCOVER_CHARTS_LOADING,
    isLoading: true
  }
}

let getChartsSuccess = (data) => {
  var male = []
  var maleOther = []
  var female = []
  var femaleOther = []
  data.male.forEach(function(item) {
    if (item.collapse) {
      maleOther.push(item)
    } else {
      male.push(item)
    }
  }, this);
  data.female.forEach(function(item) {
    if (item.collapse) {
      femaleOther.push(item)
    } else {
      female.push(item)
    }
  }, this);
  return {
    type: types.DISCOVER_CHARTS,
    isLoading: false,
    male: male,
    maleOther: maleOther,
    female: female,
    femaleOther: femaleOther
  }
}


let loadingChartsDetail = () => {
  return {
    type: types.DISCOVER_CHARTS_DETAIL_LOADING,
    isLoadingDetail: true
  }
}

let getChartsDetailSuccess = (ranking) => {
  return {
    type: types.DISCOVER_CHARTS_DETAIL,
    isLoadingDetail: false,
    chartsDetail: ranking
  }
}