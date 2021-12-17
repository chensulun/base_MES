import request from '@/utils/request'

// 查询原材盘存列表
export function listInventory(query) {
  return request({
    url: '/manage/materialTakeInventory/list',
    method: 'get',
    params: query
  })
}

// 查询原材盘存详细
export function getInventory(mtiId) {
  return request({
    url: '/manage/materialTakeInventory/' + mtiId,
    method: 'get'
  })
}

// 新增原材盘存
export function addInventory(data) {
  return request({
    url: '/manage/materialTakeInventory',
    method: 'post',
    data: data
  })
}

// 修改原材盘存
export function updateInventory(data) {
  return request({
    url: '/manage/materialTakeInventory',
    method: 'put',
    data: data
  })
}

// 删除原材盘存
export function delInventory(mtiId) {
  return request({
    url: '/manage/materialTakeInventory/' + mtiId,
    method: 'delete'
  })
}

// 导出原材盘存
export function exportInventory(query) {
  return request({
    url: '/manage/materialTakeInventory/export',
    method: 'get',
    params: query
  })
}