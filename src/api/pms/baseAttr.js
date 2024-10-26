import request from '@/utils/request'

export default {

  // 获取所有平台属性
  getfindAllBaseAttr() {
    return request({
      url: '/admin/baseAttrInfo/findAll',
      method: 'get'
    })
  },

  // 查找二级分类
  getCategory2(category1Id) {
    return request({
      url: '/admin/product/getCategory2/' + category1Id,
      method: 'get'
    })
  },

  // 查找三级分类
  getCategory3(category2Id) {
    return request({
      url: '/admin/product/getCategory3/' + category2Id,
      method: 'get'
    })
  }

}
