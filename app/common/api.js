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
  // 获取正版源(若有) 与 盗版源
  BOOK_ABOOK_SOURCE: API_BASE_URL + '/atoc', 
  // 用户偏好推荐
  // GET gender: male | female
  USER_RECOMMEND: API_BASE_URL + '/book/recommend',



  // book detail
  // GET  书籍详情
  BOOK_DETAIL: (bookId) => {return API_BASE_URL + '/book/' + bookId}, 
  // GET 热门评论 url?book=id
  BOOK_HOT_REVIEW: API_BASE_URL + '/post/review/best-by-book',
  // GET 根据id推荐书单 url?limit=3 
  BOOK_RECOMMEND_BOOK_LIST: (bookId) => {return API_BASE_URL + '/book-list/' + bookId + '/recommend'}, 
  
  // read platform
  // GET 获取书的章节信息 http://api.zhuishushenqi.com/mix-atoc/5569ba444127a49f1fa99d29?view=chapters
  READ_BOOK_CHAPTER_LIST: (bookId) => {return API_BASE_URL + '/mix-atoc/' + bookId + '?view=chapters'}, 
  // GET 获取书的章节详情
  READ_BOOK_CHAPTER_DETAIL: (chapterUrl) => {return 'http://chapter2.zhuishushenqi.com/chapter/' + chapterUrl}, 

  // discover
  // GET 排行榜
  DISCOVER_CHARTS: API_BASE_URL + '/ranking/gender',
  // GET 通过id获取排行榜详情 
  // http://api.zhuishushenqi.com/ranking/564d820bc319238a644fb408
  // 周榜：rankingId->_id
  // 月榜：rankingId->monthRank
  // 总榜：rankingId->totalRank
  DISCOVER_CHARTS_DETAIL: (id) => {return API_BASE_URL + '/ranking/' + id},



  //search
  //GET 热门关键字
  SEARCH_HOT_WORD: API_BASE_URL + '/book/hot-word', 
  //GET 关键字补全
  SEARCH_AUTO_COMPLETE: API_BASE_URL + '/book/auto-complete', 
  //GET 书籍查询
  SEARCH_BOOKS: API_BASE_URL + '/book/fuzzy-search', 
  //GET 通过作者查询书名
  SEARCH_BOOKS_FROM_AUTHOR: API_BASE_URL + '/book/accurate-search', 
}
