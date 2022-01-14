import request from '@/utils/request'

// 查询资产管理列表
export function listAssets(query) {
  return request({
    url: '/erp/assets/list',
    method: 'get',
    params: query
  })
}

// 查询资产管理详细
export function getAssets(assetsId) {
  return request({
    url: '/erp/assets/' + assetsId,
    method: 'get'
  })
}

// 新增资产管理
export function addAssets(data) {
  return request({
    url: '/erp/assets',
    method: 'post',
    data: data
  })
}

// 修改资产管理
export function updateAssets(data) {
  return request({
    url: '/erp/assets',
    method: 'put',
    data: data
  })
}

// 删除资产管理
export function delAssets(assetsId) {
  return request({
    url: '/erp/assets/' + assetsId,
    method: 'delete'
  })
}

// 导出资产管理
export function exportAssets(query) {
  return request({
    url: '/erp/assets/export',
    method: 'get',
    params: query
  })
}