import request from '@/utils/request'

// 查询配件库管理列表
export function listEquipmentParts(query) {
  return request({
    url: '/manage/equipmentParts/list',
    method: 'get',
    params: query
  })
}

// 查询配件库管理详细
export function getEquipmentParts(epId) {
  return request({
    url: '/manage/equipmentParts/' + epId,
    method: 'get'
  })
}

// 新增配件库管理
export function addEquipmentParts(data) {
  return request({
    url: '/manage/equipmentParts',
    method: 'post',
    data: data
  })
}

// 修改配件库管理
export function updateEquipmentParts(data) {
  return request({
    url: '/manage/equipmentParts',
    method: 'put',
    data: data
  })
}

// 删除配件库管理
export function delEquipmentParts(epId) {
  return request({
    url: '/manage/equipmentParts/' + epId,
    method: 'delete'
  })
}

// 导出配件库管理
export function exportEquipmentParts(query) {
  return request({
    url: '/manage/equipmentParts/export',
    method: 'get',
    params: query
  })
}