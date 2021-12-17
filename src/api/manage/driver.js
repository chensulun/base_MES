import request from '@/utils/request'

// 查询司机列表
export function listDriver(query) {
  return request({
    url: '/manage/driver/list',
    method: 'get',
    params: query
  })
}

// 查询司机详细
export function getDriver(driverId) {
  return request({
    url: '/manage/driver/' + driverId,
    method: 'get'
  })
}

// 新增司机
export function addDriver(data) {
  return request({
    url: '/manage/driver',
    method: 'post',
    data: data
  })
}

// 修改司机
export function updateDriver(data) {
  return request({
    url: '/manage/driver',
    method: 'put',
    data: data
  })
}

// 删除司机
export function delDriver(driverId) {
  return request({
    url: '/manage/driver/' + driverId,
    method: 'delete'
  })
}

// 导出司机
export function exportDriver(query) {
  return request({
    url: '/manage/driver/export',
    method: 'get',
    params: query
  })
}