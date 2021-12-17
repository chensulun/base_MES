import request from '@/utils/request'

// 查询报检设置列表
export function listDetectionSettings(query) {
  return request({
    url: '/manage/detectionSettings/list',
    method: 'get',
    params: query
  })
}

// 查询报检设置详细
export function getDetectionSettings(dsId) {
  return request({
    url: '/manage/detectionSettings/' + dsId,
    method: 'get'
  })
}

// 新增报检设置
export function addDetectionSettings(data) {
  return request({
    url: '/manage/detectionSettings',
    method: 'post',
    data: data
  })
}

// 修改报检设置
export function updateDetectionSettings(data) {
  return request({
    url: '/manage/detectionSettings',
    method: 'put',
    data: data
  })
}

// 删除报检设置
export function delDetectionSettings(dsId) {
  return request({
    url: '/manage/detectionSettings/' + dsId,
    method: 'delete'
  })
}

// 导出报检设置
export function exportDetectionSettings(query) {
  return request({
    url: '/manage/detectionSettings/export',
    method: 'get',
    params: query
  })
}