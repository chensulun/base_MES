import request from '@/utils/request'

// 查询危险源管理列表
export function listHazardSourceManagement(query) {
  return request({
    url: '/erp/hazardSourceManagement/list',
    method: 'get',
    params: query
  })
}

// 查询危险源管理详细
export function getHazardSourceManagement(hsId) {
  return request({
    url: '/erp/hazardSourceManagement/' + hsId,
    method: 'get'
  })
}

// 新增危险源管理
export function addHazardSourceManagement(data) {
  return request({
    url: '/erp/hazardSourceManagement',
    method: 'post',
    data: data
  })
}

// 修改危险源管理
export function updateHazardSourceManagement(data) {
  return request({
    url: '/erp/hazardSourceManagement',
    method: 'put',
    data: data
  })
}

// 删除危险源管理
export function delHazardSourceManagement(hsId) {
  return request({
    url: '/erp/hazardSourceManagement/' + hsId,
    method: 'delete'
  })
}

// 导出危险源管理
export function exportHazardSourceManagement(query) {
  return request({
    url: '/erp/hazardSourceManagement/export',
    method: 'get',
    params: query
  })
}