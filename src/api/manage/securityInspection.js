import request from '@/utils/request'

// 查询安全巡检列表
export function listSecurityInspection(query) {
  return request({
    url: '/manage/securityInspection/list',
    method: 'get',
    params: query
  })
}

// 查询安全巡检详细
export function getSecurityInspection(siId) {
  return request({
    url: '/manage/securityInspection/' + siId,
    method: 'get'
  })
}

// 新增安全巡检
export function addSecurityInspection(data) {
  return request({
    url: '/manage/securityInspection',
    method: 'post',
    data: data
  })
}

// 修改安全巡检
export function updateSecurityInspection(data) {
  return request({
    url: '/manage/securityInspection',
    method: 'put',
    data: data
  })
}

// 删除安全巡检
export function delSecurityInspection(siId) {
  return request({
    url: '/manage/securityInspection/' + siId,
    method: 'delete'
  })
}

// 导出安全巡检
export function exportSecurityInspection(query) {
  return request({
    url: '/manage/securityInspection/export',
    method: 'get',
    params: query
  })
}