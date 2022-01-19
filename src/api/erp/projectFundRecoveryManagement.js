import request from '@/utils/request'

// 查询项目资金回收列表
export function listProjectFundRecoveryManagement(query) {
  return request({
    url: '/erp/projectFundRecoveryManagement/list',
    method: 'get',
    params: query
  })
}

// 查询项目资金回收详细
export function getProjectFundRecoveryManagement(pfrmId) {
  return request({
    url: '/erp/projectFundRecoveryManagement/' + pfrmId,
    method: 'get'
  })
}

// 新增项目资金回收
export function addProjectFundRecoveryManagement(data) {
  return request({
    url: '/erp/projectFundRecoveryManagement',
    method: 'post',
    data: data
  })
}

// 修改项目资金回收
export function updateProjectFundRecoveryManagement(data) {
  return request({
    url: '/erp/projectFundRecoveryManagement',
    method: 'put',
    data: data
  })
}

// 删除项目资金回收
export function delProjectFundRecoveryManagement(pfrmId) {
  return request({
    url: '/erp/projectFundRecoveryManagement/' + pfrmId,
    method: 'delete'
  })
}

// 导出项目资金回收
export function exportProjectFundRecoveryManagement(query) {
  return request({
    url: '/erp/projectFundRecoveryManagement/export',
    method: 'get',
    params: query
  })
}