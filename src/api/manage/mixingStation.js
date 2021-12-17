import request from '@/utils/request'

// 查询站点信息列表
export function listMixingStation(query) {
  return request({
    url: '/manage/mixingStation/list',
    method: 'get',
    params: query
  })
}// 查询站点信息列表
export function listMixingStationByRole(query) {
  return request({
    url: '/manage/mixingStation/listByRole',
    method: 'get',
    params: query
  })
}

// 查询站点信息详细
export function getMixingStation(msId) {
  return request({
    url: '/manage/mixingStation/' + msId,
    method: 'get'
  })
}

// 新增站点信息
export function addMixingStation(data) {
  return request({
    url: '/manage/mixingStation',
    method: 'post',
    data: data
  })
}

// 修改站点信息
export function updateMixingStation(data) {
  return request({
    url: '/manage/mixingStation',
    method: 'put',
    data: data
  })
}

// 删除站点信息
export function delMixingStation(msId) {
  return request({
    url: '/manage/mixingStation/' + msId,
    method: 'delete'
  })
}

// 导出站点信息
export function exportMixingStation(query) {
  return request({
    url: '/manage/mixingStation/export',
    method: 'get',
    params: query
  })
}
