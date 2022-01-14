import request from '@/utils/request'

// 查询安全交底列表
export function listSecurityHandover(query) {
  return request({
    url: '/erp/securityHandover/list',
    method: 'get',
    params: query
  })
}

// 查询安全交底详细
export function getSecurityHandover(shId) {
  return request({
    url: '/erp/securityHandover/' + shId,
    method: 'get'
  })
}

// 新增安全交底
export function addSecurityHandover(data) {
  return request({
    url: '/erp/securityHandover',
    method: 'post',
    data: data
  })
}

// 修改安全交底
export function updateSecurityHandover(data) {
  return request({
    url: '/erp/securityHandover',
    method: 'put',
    data: data
  })
}

// 删除安全交底
export function delSecurityHandover(shId) {
  return request({
    url: '/erp/securityHandover/' + shId,
    method: 'delete'
  })
}

// 导出安全交底
export function exportSecurityHandover(query) {
  return request({
    url: '/erp/securityHandover/export',
    method: 'get',
    params: query
  })
}