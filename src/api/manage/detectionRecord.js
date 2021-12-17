import request from '@/utils/request'

// 查询报检单列表
export function listDetectionRecord(query) {
  return request({
    url: '/manage/detectionRecord/list',
    method: 'get',
    params: query
  })
}

// 查询报检单详细
export function getDetectionRecord(drId) {
  return request({
    url: '/manage/detectionRecord/' + drId,
    method: 'get'
  })
}

// 新增报检单
export function addDetectionRecord(data) {
  return request({
    url: '/manage/detectionRecord',
    method: 'post',
    data: data
  })
}

// 修改报检单
export function updateDetectionRecord(data) {
  return request({
    url: '/manage/detectionRecord',
    method: 'put',
    data: data
  })
}

// 删除报检单
export function delDetectionRecord(drId) {
  return request({
    url: '/manage/detectionRecord/' + drId,
    method: 'delete'
  })
}

// 导出报检单
export function exportDetectionRecord(query) {
  return request({
    url: '/manage/detectionRecord/export',
    method: 'get',
    params: query
  })
}