import request from '@/utils/request'

export default {

  // 查找一级分类
  getCategory1() {
    return request({
      url: '/productCategory/getCategory1',
      method: 'get'
    })
  },

  // 查找二级分类
  getCategory2(category1Id) {
    return request({
      url: '/productCategory/getCategory2/' + category1Id,
      method: 'get'
    })
  },

  // 查找三级分类
  getCategory3(category2Id) {
    return request({
      url: '/productCategory/getCategory3/' + category2Id,
      method: 'get'
    })
  }

}
