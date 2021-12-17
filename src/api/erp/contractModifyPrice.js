import request from '@/utils/request'

// 查询调价单列表
export function listContractModifyPrice(query) {
  return request({
    url: '/erp/contractModifyPrice/list',
    method: 'get',
    params: query
  })
}

// 查询调价单详细
export function getContractModifyPrice(cdpId) {
  return request({
    url: '/erp/contractModifyPrice/' + cdpId,
    method: 'get'
  })
}

// 新增调价单
export function addContractModifyPrice(data) {
  return request({
    url: '/erp/contractModifyPrice',
    method: 'post',
    data: data
  })
}

// 修改调价单
export function updateContractModifyPrice(data) {
  return request({
    url: '/erp/contractModifyPrice',
    method: 'put',
    data: data
  })
}

// 删除调价单
export function delContractModifyPrice(cdpId) {
  return request({
    url: '/erp/contractModifyPrice/' + cdpId,
    method: 'delete'
  })
}

// 导出调价单
export function exportContractModifyPrice(query) {
  return request({
    url: '/erp/contractModifyPrice/export',
    method: 'get',
    params: query
  })
}