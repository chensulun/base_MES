import request from '@/utils/request'

// 查询维保管理列表
export function listEquipmentMaintain(query) {
  return request({
    url: '/manage/equipmentMaintain/list',
    method: 'get',
    params: query
  })
}

// 查询维保管理详细
export function getEquipmentMaintain(emId) {
  return request({
    url: '/manage/equipmentMaintain/' + emId,
    method: 'get'
  })
}

// 新增维保管理
export function addEquipmentMaintain(data) {
  return request({
    url: '/manage/equipmentMaintain',
    method: 'post',
    data: data
  })
}

// 修改维保管理
export function updateEquipmentMaintain(data) {
  return request({
    url: '/manage/equipmentMaintain',
    method: 'put',
    data: data
  })
}

// 删除维保管理
export function delEquipmentMaintain(emId) {
  return request({
    url: '/manage/equipmentMaintain/' + emId,
    method: 'delete'
  })
}

// 导出维保管理
export function exportEquipmentMaintain(query) {
  return request({
    url: '/manage/equipmentMaintain/export',
    method: 'get',
    params: query
  })
}