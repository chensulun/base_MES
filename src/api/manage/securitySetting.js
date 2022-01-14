import request from '@/utils/request'

// 查询安全设置列表
export function listSecuritySetting(query) {
  return request({
    url: '/manage/securitySetting/list',
    method: 'get',
    params: query
  })
}

// 查询安全设置详细
export function getSecuritySetting(ssId) {
  return request({
    url: '/manage/securitySetting/' + ssId,
    method: 'get'
  })
}

// 新增安全设置
export function addSecuritySetting(data) {
  return request({
    url: '/manage/securitySetting',
    method: 'post',
    data: data
  })
}

// 修改安全设置
export function updateSecuritySetting(data) {
  return request({
    url: '/manage/securitySetting',
    method: 'put',
    data: data
  })
}

// 删除安全设置
export function delSecuritySetting(ssId) {
  return request({
    url: '/manage/securitySetting/' + ssId,
    method: 'delete'
  })
}

// 导出安全设置
export function exportSecuritySetting(query) {
  return request({
    url: '/manage/securitySetting/export',
    method: 'get',
    params: query
  })
}