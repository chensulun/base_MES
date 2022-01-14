import request from '@/utils/request'

// 查询安全设置-路线列表
export function listSecuritySettingRoute(query) {
  return request({
    url: '/manage/securitySettingRoute/list',
    method: 'get',
    params: query
  })
}

// 查询安全设置-路线详细
export function getSecuritySettingRoute(ssrId) {
  return request({
    url: '/manage/securitySettingRoute/' + ssrId,
    method: 'get'
  })
}

// 新增安全设置-路线
export function addSecuritySettingRoute(data) {
  return request({
    url: '/manage/securitySettingRoute',
    method: 'post',
    data: data
  })
}

// 修改安全设置-路线
export function updateSecuritySettingRoute(data) {
  return request({
    url: '/manage/securitySettingRoute',
    method: 'put',
    data: data
  })
}

// 删除安全设置-路线
export function delSecuritySettingRoute(ssrId) {
  return request({
    url: '/manage/securitySettingRoute/' + ssrId,
    method: 'delete'
  })
}

// 导出安全设置-路线
export function exportSecuritySettingRoute(query) {
  return request({
    url: '/manage/securitySettingRoute/export',
    method: 'get',
    params: query
  })
}