import request from '@/utils/request'

// 查询监控管理列表
export function listMonitor(query) {
  return request({
    url: '/manage/monitor/list',
    method: 'get',
    params: query
  })
}

// 查询监控管理详细
export function getMonitor(monitorId) {
  return request({
    url: '/manage/monitor/' + monitorId,
    method: 'get'
  })
}

// 新增监控管理
export function addMonitor(data) {
  return request({
    url: '/manage/monitor',
    method: 'post',
    data: data
  })
}

// 修改监控管理
export function updateMonitor(data) {
  return request({
    url: '/manage/monitor',
    method: 'put',
    data: data
  })
}

// 删除监控管理
export function delMonitor(monitorId) {
  return request({
    url: '/manage/monitor/' + monitorId,
    method: 'delete'
  })
}

// 导出监控管理
export function exportMonitor(query) {
  return request({
    url: '/manage/monitor/export',
    method: 'get',
    params: query
  })
}