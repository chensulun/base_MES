import request from '@/utils/request'

// 查询料仓管理列表
export function listMaterialWarehouse(query) {
  return request({
    url: '/manage/materialWarehouse/list',
    method: 'get',
    params: query
  })
}

// 查询料仓管理详细
export function getMaterialWarehouse(mwId) {
  return request({
    url: '/manage/materialWarehouse/' + mwId,
    method: 'get'
  })
}

// 新增料仓管理
export function addMaterialWarehouse(data) {
  return request({
    url: '/manage/materialWarehouse',
    method: 'post',
    data: data
  })
}

// 修改料仓管理
export function updateMaterialWarehouse(data) {
  return request({
    url: '/manage/materialWarehouse',
    method: 'put',
    data: data
  })
}

// 删除料仓管理
export function delMaterialWarehouse(mwId) {
  return request({
    url: '/manage/materialWarehouse/' + mwId,
    method: 'delete'
  })
}

// 导出料仓管理
export function exportMaterialWarehouse(query) {
  return request({
    url: '/manage/materialWarehouse/export',
    method: 'get',
    params: query
  })
}