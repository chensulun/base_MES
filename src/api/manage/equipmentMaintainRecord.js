import request from '@/utils/request'

// 查询设备保养记录列表
export function listEquipmentMaintainRecord(query) {
  return request({
    url: '/manage/equipmentMaintainRecord/list',
    method: 'get',
    params: query
  })
}

// 查询设备保养记录详细
export function getEquipmentMaintainRecord(emrId) {
  return request({
    url: '/manage/equipmentMaintainRecord/' + emrId,
    method: 'get'
  })
}

// 新增设备保养记录
export function addEquipmentMaintainRecord(data) {
  return request({
    url: '/manage/equipmentMaintainRecord',
    method: 'post',
    data: data
  })
}

// 修改设备保养记录
export function updateEquipmentMaintainRecord(data) {
  return request({
    url: '/manage/equipmentMaintainRecord',
    method: 'put',
    data: data
  })
}

// 删除设备保养记录
export function delEquipmentMaintainRecord(emrId) {
  return request({
    url: '/manage/equipmentMaintainRecord/' + emrId,
    method: 'delete'
  })
}

// 导出设备保养记录
export function exportEquipmentMaintainRecord(query) {
  return request({
    url: '/manage/equipmentMaintainRecord/export',
    method: 'get',
    params: query
  })
}