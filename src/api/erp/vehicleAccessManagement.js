import request from '@/utils/request'

// 查询车辆出入管理列表
export function listVehicleAccessManagement(query) {
  return request({
    url: '/erp/vehicleAccessManagement/list',
    method: 'get',
    params: query
  })
}

// 查询车辆出入管理详细
export function getVehicleAccessManagement(vamId) {
  return request({
    url: '/erp/vehicleAccessManagement/' + vamId,
    method: 'get'
  })
}

// 新增车辆出入管理
export function addVehicleAccessManagement(data) {
  return request({
    url: '/erp/vehicleAccessManagement',
    method: 'post',
    data: data
  })
}

// 修改车辆出入管理
export function updateVehicleAccessManagement(data) {
  return request({
    url: '/erp/vehicleAccessManagement',
    method: 'put',
    data: data
  })
}

// 删除车辆出入管理
export function delVehicleAccessManagement(vamId) {
  return request({
    url: '/erp/vehicleAccessManagement/' + vamId,
    method: 'delete'
  })
}

// 导出车辆出入管理
export function exportVehicleAccessManagement(query) {
  return request({
    url: '/erp/vehicleAccessManagement/export',
    method: 'get',
    params: query
  })
}