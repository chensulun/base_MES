import request from '@/utils/request'

// 查询安全审批列表
export function listSecurityApprove(query) {
  return request({
    url: '/erp/securityApprove/list',
    method: 'get',
    params: query
  })
}

// 查询安全审批详细
export function getSecurityApprove(saId) {
  return request({
    url: '/erp/securityApprove/' + saId,
    method: 'get'
  })
}

// 新增安全审批
export function addSecurityApprove(data) {
  return request({
    url: '/erp/securityApprove',
    method: 'post',
    data: data
  })
}

// 修改安全审批
export function updateSecurityApprove(data) {
  return request({
    url: '/erp/securityApprove',
    method: 'put',
    data: data
  })
}

// 删除安全审批
export function delSecurityApprove(saId) {
  return request({
    url: '/erp/securityApprove/' + saId,
    method: 'delete'
  })
}

// 导出安全审批
export function exportSecurityApprove(query) {
  return request({
    url: '/erp/securityApprove/export',
    method: 'get',
    params: query
  })
}