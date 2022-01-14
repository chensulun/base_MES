import request from '@/utils/request'

// 查询归还管理列表
export function listMaterialBack(query) {
  return request({
    url: '/manage/materialBack/list',
    method: 'get',
    params: query
  })
}

// 查询归还管理详细
export function getMaterialBack(id) {
  return request({
    url: '/manage/materialBack/' + id,
    method: 'get'
  })
}

// 新增归还管理
export function addMaterialBack(data) {
  return request({
    url: '/manage/materialBack',
    method: 'post',
    data: data
  })
}

// 修改归还管理
export function updateMaterialBack(data) {
  return request({
    url: '/manage/materialBack',
    method: 'put',
    data: data
  })
}

// 删除归还管理
export function delMaterialBack(id) {
  return request({
    url: '/manage/materialBack/' + id,
    method: 'delete'
  })
}

// 导出归还管理
export function exportMaterialBack(query) {
  return request({
    url: '/manage/materialBack/export',
    method: 'get',
    params: query
  })
}