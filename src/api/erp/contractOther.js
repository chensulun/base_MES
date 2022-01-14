import request from '@/utils/request'

// 查询其他销售列表
export function listContractOther(query) {
  return request({
    url: '/erp/contractOther/list',
    method: 'get',
    params: query
  })
}

// 查询其他销售详细
export function getContractOther(coId) {
  return request({
    url: '/erp/contractOther/' + coId,
    method: 'get'
  })
}

// 新增其他销售
export function addContractOther(data) {
  return request({
    url: '/erp/contractOther',
    method: 'post',
    data: data
  })
}

// 修改其他销售
export function updateContractOther(data) {
  return request({
    url: '/erp/contractOther',
    method: 'put',
    data: data
  })
}

// 删除其他销售
export function delContractOther(coId) {
  return request({
    url: '/erp/contractOther/' + coId,
    method: 'delete'
  })
}

// 导出其他销售
export function exportContractOther(query) {
  return request({
    url: '/erp/contractOther/export',
    method: 'get',
    params: query
  })
}