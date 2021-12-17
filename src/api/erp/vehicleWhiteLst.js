import request from '@/utils/request'

// 查询车辆白名单列表
export function listVehicleWhiteLst(query) {
  return request({
    url: '/erp/vehicleWhiteLst/list',
    method: 'get',
    params: query
  })
}

// 查询车辆白名单详细
export function getVehicleWhiteLst(vwlId) {
  return request({
    url: '/erp/vehicleWhiteLst/' + vwlId,
    method: 'get'
  })
}

// 新增车辆白名单
export function addVehicleWhiteLst(data) {
  return request({
    url: '/erp/vehicleWhiteLst',
    method: 'post',
    data: data
  })
}

// 修改车辆白名单
export function updateVehicleWhiteLst(data) {
  return request({
    url: '/erp/vehicleWhiteLst',
    method: 'put',
    data: data
  })
}

// 删除车辆白名单
export function delVehicleWhiteLst(vwlId) {
  return request({
    url: '/erp/vehicleWhiteLst/' + vwlId,
    method: 'delete'
  })
}

// 导出车辆白名单
export function exportVehicleWhiteLst(query) {
  return request({
    url: '/erp/vehicleWhiteLst/export',
    method: 'get',
    params: query
  })
}