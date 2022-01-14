import request from '@/utils/request'

// 查询借用管理列表
export function listMaterialBorrow(query) {
  return request({
    url: '/manage/materialBorrow/list',
    method: 'get',
    params: query
  })
}

// 查询借用管理详细
export function getMaterialBorrow(mbId) {
  return request({
    url: '/manage/materialBorrow/' + mbId,
    method: 'get'
  })
}

// 新增借用管理
export function addMaterialBorrow(data) {
  return request({
    url: '/manage/materialBorrow',
    method: 'post',
    data: data
  })
}

// 修改借用管理
export function updateMaterialBorrow(data) {
  return request({
    url: '/manage/materialBorrow',
    method: 'put',
    data: data
  })
}

// 删除借用管理
export function delMaterialBorrow(mbId) {
  return request({
    url: '/manage/materialBorrow/' + mbId,
    method: 'delete'
  })
}

// 导出借用管理
export function exportMaterialBorrow(query) {
  return request({
    url: '/manage/materialBorrow/export',
    method: 'get',
    params: query
  })
}