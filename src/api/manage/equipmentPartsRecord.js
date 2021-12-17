import request from '@/utils/request'

// 查询配件库消耗记录列表
export function listEquipmentPartsRecord(query) {
  return request({
    url: '/manage/equipmentPartsRecord/list',
    method: 'get',
    params: query
  })
}

// 查询配件库消耗记录详细
export function getEquipmentPartsRecord(eprId) {
  return request({
    url: '/manage/equipmentPartsRecord/' + eprId,
    method: 'get'
  })
}

// 新增配件库消耗记录
export function addEquipmentPartsRecord(data) {
  return request({
    url: '/manage/equipmentPartsRecord',
    method: 'post',
    data: data
  })
}

// 修改配件库消耗记录
export function updateEquipmentPartsRecord(data) {
  return request({
    url: '/manage/equipmentPartsRecord',
    method: 'put',
    data: data
  })
}

// 删除配件库消耗记录
export function delEquipmentPartsRecord(eprId) {
  return request({
    url: '/manage/equipmentPartsRecord/' + eprId,
    method: 'delete'
  })
}

// 导出配件库消耗记录
export function exportEquipmentPartsRecord(query) {
  return request({
    url: '/manage/equipmentPartsRecord/export',
    method: 'get',
    params: query
  })
}