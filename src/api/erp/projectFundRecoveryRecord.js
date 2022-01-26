import request from '@/utils/request'

// 查询项目资金回收记录列表
export function listProjectFundRecoveryRecord(query) {
  return request({
    url: '/erp/projectFundRecoveryRecord/list',
    method: 'get',
    params: query
  })
}

// 查询项目资金回收记录详细
export function getProjectFundRecoveryRecord(pfrrId) {
  return request({
    url: '/erp/projectFundRecoveryRecord/' + pfrrId,
    method: 'get'
  })
}

// 新增项目资金回收记录
export function addProjectFundRecoveryRecord(data) {
  return request({
    url: '/erp/projectFundRecoveryRecord',
    method: 'post',
    data: data
  })
}

// 修改项目资金回收记录
export function updateProjectFundRecoveryRecord(data) {
  return request({
    url: '/erp/projectFundRecoveryRecord',
    method: 'put',
    data: data
  })
}

// 删除项目资金回收记录
export function delProjectFundRecoveryRecord(pfrrId) {
  return request({
    url: '/erp/projectFundRecoveryRecord/' + pfrrId,
    method: 'delete'
  })
}

// 导出项目资金回收记录
export function exportProjectFundRecoveryRecord(query) {
  return request({
    url: '/erp/projectFundRecoveryRecord/export',
    method: 'get',
    params: query
  })
}