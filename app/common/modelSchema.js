/*
 * description: the model schema for realm
 * author: 麦芽糖
 * time: 2017年04月04日14:44:45
 */

const HistoryBookSchema = {
  name: 'HistoryBook',
  primaryKey: 'bookId',
  properties: {
    bookId: 'string',
    bookName: 'string',
    bookUrl: 'string',
    lastChapterTitle: 'string',
    lastChapterTime: 'string',
    historyChapterNum: 'int',
    saveTime: 'date',
    sortNum: 'int',
    isToShow: 'bool'
  }
}

const schemaArray = [HistoryBookSchema]

module.exports = schemaArray