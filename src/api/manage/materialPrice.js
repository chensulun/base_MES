import request from '@/utils/request'

// 查询价格管理列表
export function listMaterialPrice(query) {
  return request({
    url: '/manage/materialPrice/list',
    method: 'get',
    params: query
  })
}

// 查询价格管理详细
export function getMaterialPrice(mpId) {
  return request({
    url: '/manage/materialPrice/' + mpId,
    method: 'get'
  })
}

// 新增价格管理
export function addMaterialPrice(data) {
  return request({
    url: '/manage/materialPrice',
    method: 'post',
    data: data
  })
}

// 修改价格管理
export function updateMaterialPrice(data) {
  return request({
    url: '/manage/materialPrice',
    method: 'put',
    data: data
  })
}

// 删除价格管理
export function delMaterialPrice(mpId) {
  return request({
    url: '/manage/materialPrice/' + mpId,
    method: 'delete'
  })
}

// 导出价格管理
export function exportMaterialPrice(query) {
  return request({
    url: '/manage/materialPrice/export',
    method: 'get',
    params: query
  })
}