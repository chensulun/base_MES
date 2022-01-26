import request from '@/utils/request'

// 查询决算列表列表
export function listFinalAccountManagement(query) {
  return request({
    url: '/erp/finalAccountManagement/list',
    method: 'get',
    params: query
  })
}

export function listByDetailsFinalAccountManagement(query) {
  return request({
    url: '/erp/finalAccountManagement/listByDetails',
    method: 'get',
    params: query
  })
}

// 查询决算列表详细
export function getFinalAccountManagement(famId) {
  return request({
    url: '/erp/finalAccountManagement/' + famId,
    method: 'get'
  })
}

// 新增决算列表
export function addFinalAccountManagement(data) {
  return request({
    url: '/erp/finalAccountManagement',
    method: 'post',
    data: data
  })
}

// 修改决算列表
export function updateFinalAccountManagement(data) {
  return request({
    url: '/erp/finalAccountManagement',
    method: 'put',
    data: data
  })
}

// 删除决算列表
export function delFinalAccountManagement(famId) {
  return request({
    url: '/erp/finalAccountManagement/' + famId,
    method: 'delete'
  })
}

// 导出决算列表
export function exportFinalAccountManagement(query) {
  return request({
    url: '/erp/finalAccountManagement/export',
    method: 'get',
    params: query
  })
}
