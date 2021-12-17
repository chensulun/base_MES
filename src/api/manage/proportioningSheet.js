import request from '@/utils/request'

// 查询配比单列表
export function listProportioningSheet(query) {
  return request({
    url: '/manage/proportioningSheet/list',
    method: 'get',
    params: query
  })
}

// 查询配比单详细
export function getProportioningSheet(psId) {
  return request({
    url: '/manage/proportioningSheet/' + psId,
    method: 'get'
  })
}

// 新增配比单
export function addProportioningSheet(data) {
  return request({
    url: '/manage/proportioningSheet',
    method: 'post',
    data: data
  })
}

// 修改配比单
export function updateProportioningSheet(data) {
  return request({
    url: '/manage/proportioningSheet',
    method: 'put',
    data: data
  })
}

// 删除配比单
export function delProportioningSheet(psId) {
  return request({
    url: '/manage/proportioningSheet/' + psId,
    method: 'delete'
  })
}

// 导出配比单
export function exportProportioningSheet(query) {
  return request({
    url: '/manage/proportioningSheet/export',
    method: 'get',
    params: query
  })
}