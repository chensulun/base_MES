import request from '@/utils/request'

// 查询资产管理列表
export function listEquipment(query) {
  return request({
    url: '/manage/equipment/list',
    method: 'get',
    params: query
  })
}

// 查询资产管理详细
export function getEquipment(equipmentId) {
  return request({
    url: '/manage/equipment/' + equipmentId,
    method: 'get'
  })
}

// 新增资产管理
export function addEquipment(data) {
  return request({
    url: '/manage/equipment',
    method: 'post',
    data: data
  })
}

// 修改资产管理
export function updateEquipment(data) {
  return request({
    url: '/manage/equipment',
    method: 'put',
    data: data
  })
}

// 删除资产管理
export function delEquipment(equipmentId) {
  return request({
    url: '/manage/equipment/' + equipmentId,
    method: 'delete'
  })
}

// 导出资产管理
export function exportEquipment(query) {
  return request({
    url: '/manage/equipment/export',
    method: 'get',
    params: query
  })
}