/*
 * description: the api for app
 * author: 麦芽糖
 * time: 2017年03月12日21:09:37
 */

const API_BASE_URL = 'http://api.zhuishushenqi.com'
const IMG_BASE_URL = 'http://statics.zhuishushenqi.com'

module.exports = {
  API_BASE_URL: API_BASE_URL,
  IMG_BASE_URL: IMG_BASE_URL,

  BOOK_RECOMMEND: API_BASE_URL + '/book/recommend',
  BOOK_ABOOK_SOURCE: API_BASE_URL + '/atoc', // 获取正版源(若有) 与 盗版源


  // 用户偏好推荐
  USER_RECOMMEND: API_BASE_URL + '/book/recommend',// GET gender: male | female

  // book detial
  BOOK_DETIAL: (bookId) => {return API_BASE_URL + '/book/' + bookId}, // GET  书籍详情
  BOOK_HOT_REVIEW: API_BASE_URL + '/post/review/best-by-book', // GET 热门评论 url?book=id
  BOOK_RECOMMEND_BOOK_LIST: (bookId) => {return API_BASE_URL + '/book-list/' + bookId + '/recommend'}, // GET 根据id推荐书单 url?limit=3 
  
  // read platform
  READ_BOOK_CHAPTER_LIST: (bookId) => {return API_BASE_URL + '/mix-atoc/' + bookId + '?view=chapters'}, // GET 获取书的章节信息 http://api.zhuishushenqi.com/mix-atoc/5569ba444127a49f1fa99d29?view=chapters
  READ_BOOK_CHAPTER_DETIAL: (chapterUrl) => {return 'http://chapter2.zhuishushenqi.com/chapter/' + chapterUrl}, // GET 获取书的章节详情

  // 排行榜


  //search
  SEARCH_HOT_WORD: API_BASE_URL + '/book/hot-word', //GET 热门关键字
  SEARCH_AUTO_COMPLETE: API_BASE_URL + '/book/auto-complete', //GET 关键字补全
  SEARCH_BOOKS: API_BASE_URL + '/book/fuzzy-search', //GET 书籍查询
  SEARCH_BOOKS_FROM_AUTHOR: API_BASE_URL + '/book/accurate-search', //GET 通过作者查询书名
}
