import request from '@/utils/request'

// 查询维修记录列表
export function listMaintenanceRecord(query) {
  return request({
    url: '/manage/maintenanceRecord/list',
    method: 'get',
    params: query
  })
}

// 查询维修记录详细
export function getMaintenanceRecord(emrId) {
  return request({
    url: '/manage/maintenanceRecord/' + emrId,
    method: 'get'
  })
}

// 新增维修记录
export function addMaintenanceRecord(data) {
  return request({
    url: '/manage/maintenanceRecord',
    method: 'post',
    data: data
  })
}

// 修改维修记录
export function updateMaintenanceRecord(data) {
  return request({
    url: '/manage/maintenanceRecord',
    method: 'put',
    data: data
  })
}

// 删除维修记录
export function delMaintenanceRecord(emrId) {
  return request({
    url: '/manage/maintenanceRecord/' + emrId,
    method: 'delete'
  })
}

// 导出维修记录
export function exportMaintenanceRecord(query) {
  return request({
    url: '/manage/maintenanceRecord/export',
    method: 'get',
    params: query
  })
}