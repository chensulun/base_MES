import request from '@/utils/request'

// 查询称重记录列表
export function listWeighRecord(query) {
  return request({
    url: '/manage/weighRecord/list',
    method: 'get',
    params: query
  })
}

// 查询称重记录详细
export function getWeighRecord(weighId) {
  return request({
    url: '/manage/weighRecord/' + weighId,
    method: 'get'
  })
}

// 新增称重记录
export function addWeighRecord(data) {
  return request({
    url: '/manage/weighRecord',
    method: 'post',
    data: data
  })
}

// 修改称重记录
export function updateWeighRecord(data) {
  return request({
    url: '/manage/weighRecord',
    method: 'put',
    data: data
  })
}

// 删除称重记录
export function delWeighRecord(weighId) {
  return request({
    url: '/manage/weighRecord/' + weighId,
    method: 'delete'
  })
}

// 导出称重记录
export function exportWeighRecord(query) {
  return request({
    url: '/manage/weighRecord/export',
    method: 'get',
    params: query
  })
}

// 导出称重记录
export function img(prId,code) {
  return request({
    url: '/manage/weighRecord/img/'+prId+"/"+code,
    method: 'get'
  })
}
