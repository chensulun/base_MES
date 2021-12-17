import request from '@/utils/request'

// 查询运费列表
export function listFreight(query) {
  return request({
    url: '/manage/freight/list',
    method: 'get',
    params: query
  })
}

// 查询运费详细
export function getFreight(freightId) {
  return request({
    url: '/manage/freight/' + freightId,
    method: 'get'
  })
}

// 新增运费
export function addFreight(data) {
  return request({
    url: '/manage/freight',
    method: 'post',
    data: data
  })
}

// 修改运费
export function updateFreight(data) {
  return request({
    url: '/manage/freight',
    method: 'put',
    data: data
  })
}

// 删除运费
export function delFreight(freightId) {
  return request({
    url: '/manage/freight/' + freightId,
    method: 'delete'
  })
}

// 导出运费
export function exportFreight(query) {
  return request({
    url: '/manage/freight/export',
    method: 'get',
    params: query
  })
}