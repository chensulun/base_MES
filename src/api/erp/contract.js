import request from '@/utils/request'

// 查询合同管理列表
export function listContract(query) {
  return request({
    url: '/erp/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同管理详细
export function getContract(contractId) {
  return request({
    url: '/erp/contract/' + contractId,
    method: 'get'
  })
}

// 新增合同管理
export function addContract(data) {
  return request({
    url: '/erp/contract',
    method: 'post',
    data: data
  })
}

// 修改合同管理
export function updateContract(data) {
  return request({
    url: '/erp/contract',
    method: 'put',
    data: data
  })
}

// 删除合同管理
export function delContract(contractId) {
  return request({
    url: '/erp/contract/' + contractId,
    method: 'delete'
  })
}

// 导出合同管理
export function exportContract(query) {
  return request({
    url: '/erp/contract/export',
    method: 'get',
    params: query
  })
}


// 合同材料价格表
export function priceList(query) {
  return request({
    url: '/erp/contract/priceList',
    method: 'get',
    params: query
  })
}
