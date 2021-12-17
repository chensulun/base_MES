import request from '@/utils/request'

// 查询设备信息列表
export function listProductionEquipment(query) {
  return request({
    url: '/manage/productionEquipment/list',
    method: 'get',
    params: query
  })
}

// 查询设备信息详细
export function getProductionEquipment(peId) {
  return request({
    url: '/manage/productionEquipment/' + peId,
    method: 'get'
  })
}

// 新增设备信息
export function addProductionEquipment(data) {
  return request({
    url: '/manage/productionEquipment',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateProductionEquipment(data) {
  return request({
    url: '/manage/productionEquipment',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delProductionEquipment(peId) {
  return request({
    url: '/manage/productionEquipment/' + peId,
    method: 'delete'
  })
}

// 导出设备信息
export function exportProductionEquipment(query) {
  return request({
    url: '/manage/productionEquipment/export',
    method: 'get',
    params: query
  })
}