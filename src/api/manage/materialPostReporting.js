import request from '@/utils/request'

// 查询原材报岗列表
export function listMaterialPostReporting(query) {
  return request({
    url: '/manage/materialPostReporting/list',
    method: 'get',
    params: query
  })
}

// 查询原材报岗详细
export function getMaterialPostReporting(mprId) {
  return request({
    url: '/manage/materialPostReporting/' + mprId,
    method: 'get'
  })
}

// 新增原材报岗
export function addMaterialPostReporting(data) {
  return request({
    url: '/manage/materialPostReporting',
    method: 'post',
    data: data
  })
}

// 修改原材报岗
export function updateMaterialPostReporting(data) {
  return request({
    url: '/manage/materialPostReporting',
    method: 'put',
    data: data
  })
}

// 删除原材报岗
export function delMaterialPostReporting(mprId) {
  return request({
    url: '/manage/materialPostReporting/' + mprId,
    method: 'delete'
  })
}

// 导出原材报岗
export function exportMaterialPostReporting(query) {
  return request({
    url: '/manage/materialPostReporting/export',
    method: 'get',
    params: query
  })
}