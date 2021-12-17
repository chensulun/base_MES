import request from '@/utils/request'

// 查询合同列表
export function listContract(query) {
  return request({
    url: '/manage/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同详细
export function getContract(contractId) {
  return request({
    url: '/manage/contract/' + contractId,
    method: 'get'
  })
}

// 新增合同
export function addContract(data) {
  return request({
    url: '/manage/contract',
    method: 'post',
    data: data
  })
}

// 修改合同
export function updateContract(data) {
  return request({
    url: '/manage/contract',
    method: 'put',
    data: data
  })
}

// 删除合同
export function delContract(contractId) {
  return request({
    url: '/manage/contract/' + contractId,
    method: 'delete'
  })
}

// 导出合同
export function exportContract(query) {
  return request({
    url: '/manage/contract/export',
    method: 'get',
    params: query
  })
}
