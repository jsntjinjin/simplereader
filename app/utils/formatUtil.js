/*
 * description: 时间/字数格式化工具
 * author: 麦芽糖
 * time: 2017年04月19日23:18:14
 */

'use strict'

const ONE_MINUTE = 60000;
const ONE_HOUR = 3600000;
const ONE_DAY = 86400000;
const ONE_WEEK = 604800000;

const ONE_SECOND_AGO = "秒前";
const ONE_MINUTE_AGO = "分钟前";
const ONE_HOUR_AGO = "小时前";
const ONE_DAY_AGO = "天前";
const ONE_MONTH_AGO = "个月前";
const ONE_YEAR_AGO = "年前";

let toSeconds = (date) => {
    return date / 1000
}

let toMinutes = (date) => {
    return toSeconds(date) / 60
}

let toHours = (date) => {
    return toMinutes(date) / 60
}

let toDays = (date) => {
    return toHours(date) / 24
}

let toMonths = (date) => {
    return toDays(date) / 30
}

let toYears = (date) => {
    return toMonths(date) / 365
}

let _getDescriptionTimeFromDate = (date) => {
  let delta = new Date().getTime() - date
  if (delta < 1 * ONE_MINUTE) {
      let seconds = parseInt(toSeconds(delta))
      return (seconds <= 0 ? 1 : seconds) + ONE_SECOND_AGO;
  }
  if (delta < 45 * ONE_MINUTE) {
      let minutes = parseInt(toMinutes(delta))
      return (minutes <= 0 ? 1 : minutes) + ONE_MINUTE_AGO;
  }
  if (delta < 24 * ONE_HOUR) {
      let hours = parseInt(toHours(delta))
      return (hours <= 0 ? 1 : hours) + ONE_HOUR_AGO;
  }
  if (delta < 48 * ONE_HOUR) {
      return "昨天";
  }
  if (delta < 30 * ONE_DAY) {
      let days = parseInt(toDays(delta))
      return (days <= 0 ? 1 : days) + ONE_DAY_AGO;
  }
  if (delta < 12 * 4 * ONE_WEEK) {
      let months = parseInt(toMonths(delta))
      return (months <= 0 ? 1 : months) + ONE_MONTH_AGO;
  } else { 
      let years = parseInt(toYears(delta))
      return (years <= 0 ? 1 : years) + ONE_YEAR_AGO
  }
}

export let dateFormat = (date) => {
  if (!date) {
    return ''
  } else {
    let temp = date.replace('T', ' ').split('.')[0]
    return _getDescriptionTimeFromDate(parseDate(temp))
  }
}

export let wordCountFormat = (wordCount) => {
  if (wordCount / 10000 > 0) {
      return parseInt((wordCount / 10000) + 0.5) + '万字';
  } else if (wordCount / 1000 > 0) {
      return parseInt((wordCount / 1000) + 0.5) + '千字';
  } else {
      return wordCount + '字';
  }
}

export let parseDate = (date) => {
  var isoExp, parts
  isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s(\d\d):(\d\d):(\d\d)\s*$/
  try {
    parts = isoExp.exec(date)
  } catch (error) {
    return date
  }
  if (parts) {
    date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]).getTime()
  } else {
    return date
  }
  return date
}