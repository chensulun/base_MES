import request from '@/utils/request'

// 查询车辆列表
export function listVehicle(query) {
  return request({
    url: '/manage/vehicle/list',
    method: 'get',
    params: query
  })
}

// 查询车辆详细
export function getVehicle(vehicleId) {
  return request({
    url: '/manage/vehicle/' + vehicleId,
    method: 'get'
  })
}

// 新增车辆
export function addVehicle(data) {
  return request({
    url: '/manage/vehicle',
    method: 'post',
    data: data
  })
}

// 修改车辆
export function updateVehicle(data) {
  return request({
    url: '/manage/vehicle',
    method: 'put',
    data: data
  })
}

// 删除车辆
export function delVehicle(vehicleId) {
  return request({
    url: '/manage/vehicle/' + vehicleId,
    method: 'delete'
  })
}

// 导出车辆
export function exportVehicle(query) {
  return request({
    url: '/manage/vehicle/export',
    method: 'get',
    params: query
  })
}