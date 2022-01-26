import request from '@/utils/request'

// 查询决算阶段列表
export function listFinalAccountStage(query) {
  return request({
    url: '/erp/finalAccountStage/list',
    method: 'get',
    params: query
  })
}

// 查询决算阶段详细
export function getFinalAccountStage(fasId) {
  return request({
    url: '/erp/finalAccountStage/' + fasId,
    method: 'get'
  })
}

// 新增决算阶段
export function addFinalAccountStage(data) {
  return request({
    url: '/erp/finalAccountStage',
    method: 'post',
    data: data
  })
}

// 修改决算阶段
export function updateFinalAccountStage(data) {
  return request({
    url: '/erp/finalAccountStage',
    method: 'put',
    data: data
  })
}

// 删除决算阶段
export function delFinalAccountStage(fasId) {
  return request({
    url: '/erp/finalAccountStage/' + fasId,
    method: 'delete'
  })
}

// 导出决算阶段
export function exportFinalAccountStage(query) {
  return request({
    url: '/erp/finalAccountStage/export',
    method: 'get',
    params: query
  })
}