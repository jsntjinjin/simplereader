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



  // ----------------book detail----------------
  // GET  书籍详情
  BOOK_DETAIL: (bookId) => {return API_BASE_URL + '/book/' + bookId}, 
  // GET 热门评论 url?book=id
  BOOK_HOT_REVIEW: API_BASE_URL + '/post/review/best-by-book',
  // GET 根据id推荐书单 url?limit=3 
  BOOK_RECOMMEND_BOOK_LIST: (bookId) => {return API_BASE_URL + '/book-list/' + bookId + '/recommend'}, 
  
  // ----------------read platform----------------
  // GET 获取书的章节信息 http://api.zhuishushenqi.com/mix-atoc/5569ba444127a49f1fa99d29?view=chapters
  READ_BOOK_CHAPTER_LIST: (bookId) => {return API_BASE_URL + '/mix-atoc/' + bookId + '?view=chapters'}, 
  // GET 获取书的章节详情
  READ_BOOK_CHAPTER_DETAIL: (chapterUrl) => {return 'http://chapter2.zhuishushenqi.com/chapter/' + chapterUrl}, 

  // ----------------discover----------------
  // GET 排行榜
  DISCOVER_CHARTS: API_BASE_URL + '/ranking/gender',
  /**  
   * GET 通过id获取排行榜详情 
   * http://api.zhuishushenqi.com/ranking/564d820bc319238a644fb408
   * 周榜：id->_id
   * 月榜：id->monthRank
   * 总榜：id->totalRank
   */
  DISCOVER_CHARTS_DETAIL: (id) => {return API_BASE_URL + '/ranking/' + id},
  /**
   * GET 获取主题书单列表
   * @param 本周最热：duration=last-seven-days&sort=collectorCount
   * @param 最新发布：duration=all&sort=created
   * @param 最多收藏：duration=all&sort=collectorCount
   * @param start 从多少开始请求
   * @param tag 都市、古代、架空、重生、玄幻、网游
   * @param gender male、female
   * @param limit  20
   */
  DISCOVER_BOOK_LIST: API_BASE_URL + '/book-list',
  // GET 获取主题书单标签列表
  DISCOVER_BOOK_LIST_TAG: API_BASE_URL + '/book-list/tagType',
  // GET 获取书单详情
  DISCOVER_BOOK_LIST_DETAIL: (bookListId) => {return API_BASE_URL + '/book-list/' + bookListId},
  // GET 获取分类
  DISCOVER_CATEGORY_LIST: API_BASE_URL + '/cats/lv2/statistics',
  // GET 获取二级分类
  DISCOVER_CATEGORY_LIST_V2: API_BASE_URL + '/cats/lv2',
  /**
   * GET 按分类获取书籍列表
   * @param gender male、female
   * @param type   hot(热门)、new(新书)、reputation(好评)、over(完结)
   * @param major  玄幻
   * @param start  从多少开始请求
   * @param minor  东方玄幻、异界大陆、异界争霸、远古神话
   * @param limit  50
   */
  DISCOVER_CATEGORY_BOOKS: API_BASE_URL + '/book/by-categories',

  // ----------------search----------------
  // GET 热门关键字
  SEARCH_HOT_WORD: API_BASE_URL + '/book/hot-word', 
  // GET 关键字补全
  SEARCH_AUTO_COMPLETE: API_BASE_URL + '/book/auto-complete', 
  // GET 书籍查询
  SEARCH_BOOKS: API_BASE_URL + '/book/fuzzy-search', 
  // GET 通过作者查询书名
  SEARCH_BOOKS_FROM_AUTHOR: API_BASE_URL + '/book/accurate-search', 
}
