/*
 * description: the model schema for realm
 * author: 麦芽糖
 * time: 2017年04月04日14:44:45
 */

// 书架
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
    isToShow: 'int' // 0: 不显示 1: 书架 2: 养肥区
  }
}

// 我的书单
const MyCollectionBookListsSchema = {
  name: 'MyCollectionBookLists',
  primaryKey: 'id',
  properties: {
    id: 'string',
    author: 'string',
    bookCount: 'int',
    collectorCount: 'int',
    cover: 'string',
    desc: 'string',
    title: 'string',
    gender: 'string',
    collectionTime: 'date',
    isToShow: 'bool'
  }
}

const schemaArray = [HistoryBookSchema, MyCollectionBookListsSchema]

module.exports = schemaArray