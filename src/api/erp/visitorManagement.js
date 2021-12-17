import request from '@/utils/request'

// 查询访客管理列表
export function listVisitorManagement(query) {
  return request({
    url: '/erp/visitorManagement/list',
    method: 'get',
    params: query
  })
}

// 查询访客管理详细
export function getVisitorManagement(vmId) {
  return request({
    url: '/erp/visitorManagement/' + vmId,
    method: 'get'
  })
}

// 新增访客管理
export function addVisitorManagement(data) {
  return request({
    url: '/erp/visitorManagement',
    method: 'post',
    data: data
  })
}

// 修改访客管理
export function updateVisitorManagement(data) {
  return request({
    url: '/erp/visitorManagement',
    method: 'put',
    data: data
  })
}

// 删除访客管理
export function delVisitorManagement(vmId) {
  return request({
    url: '/erp/visitorManagement/' + vmId,
    method: 'delete'
  })
}

// 导出访客管理
export function exportVisitorManagement(query) {
  return request({
    url: '/erp/visitorManagement/export',
    method: 'get',
    params: query
  })
}