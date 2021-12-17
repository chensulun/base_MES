import request from '@/utils/request'

// 查询车队信息列表
export function listFleet(query) {
  return request({
    url: '/manage/fleet/list',
    method: 'get',
    params: query
  })
}

// 查询车队信息详细
export function getFleet(fleetId) {
  return request({
    url: '/manage/fleet/' + fleetId,
    method: 'get'
  })
}

// 新增车队信息
export function addFleet(data) {
  return request({
    url: '/manage/fleet',
    method: 'post',
    data: data
  })
}

// 修改车队信息
export function updateFleet(data) {
  return request({
    url: '/manage/fleet',
    method: 'put',
    data: data
  })
}

// 删除车队信息
export function delFleet(fleetId) {
  return request({
    url: '/manage/fleet/' + fleetId,
    method: 'delete'
  })
}

// 导出车队信息
export function exportFleet(query) {
  return request({
    url: '/manage/fleet/export',
    method: 'get',
    params: query
  })
}