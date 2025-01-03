import request from '@/utils/request'
export default {

    //所有商品分类
    fetchAllCategoryList(){
        return request({
            url: `/productCategory/list/all`,
            method:'get'
        })
    },

    fetchListByParentId(type,parentId){
        return request({
            url: `/productCategory/list/${type}/${parentId}`,
            method:'get'
        })
    },

    //添加产品分类
    createProductCate(data) {
      return request({
        url:'/productCategory/create',
        method:'post',
        data:data
      })
    },

    //根据level查询分类
    fetchListByLevel(level) {
        return request({
            url: '/productCategory/list/level/' + level,
            method: 'get'
        })
    },

    //根据parentId查询分类
    fetchList(parentId) {
        return request({
            url: '/productCategory/list/' + parentId,
            method: 'get'
        })
    },

    // 查找一级分类
    getCategory() {
        return request({
            url: '/productCategory/getCategory1',
            method: 'get'
        })
    },

    // 查找一级分类
    getCategory1() {
        return request({
            url: '/admin/product/getCategory1',
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
    },






}
