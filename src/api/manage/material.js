import request from '@/utils/request'

// 查询原材列表
export function listMaterial(query) {
  return request({
    url: '/manage/material/list',
    method: 'get',
    params: query
  })
}

// 查询原材详细
export function getMaterial(materialId) {
  return request({
    url: '/manage/material/' + materialId,
    method: 'get'
  })
}

// 新增原材
export function addMaterial(data) {
  return request({
    url: '/manage/material',
    method: 'post',
    data: data
  })
}

// 修改原材
export function updateMaterial(data) {
  return request({
    url: '/manage/material',
    method: 'put',
    data: data
  })
}

// 删除原材
export function delMaterial(materialId) {
  return request({
    url: '/manage/material/' + materialId,
    method: 'delete'
  })
}

// 导出原材
export function exportMaterial(query) {
  return request({
    url: '/manage/material/export',
    method: 'get',
    params: query
  })
}