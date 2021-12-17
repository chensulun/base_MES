import request from '@/utils/request'

// 查询质量参数设置列表
export function listQualityParameters(query) {
  return request({
    url: '/manage/qualityParameters/list',
    method: 'get',
    params: query
  })
}

// 查询质量参数设置详细
export function getQualityParameters(qpId) {
  return request({
    url: '/manage/qualityParameters/' + qpId,
    method: 'get'
  })
}

// 新增质量参数设置
export function addQualityParameters(data) {
  return request({
    url: '/manage/qualityParameters',
    method: 'post',
    data: data
  })
}

// 修改质量参数设置
export function updateQualityParameters(data) {
  return request({
    url: '/manage/qualityParameters',
    method: 'put',
    data: data
  })
}

// 删除质量参数设置
export function delQualityParameters(qpId) {
  return request({
    url: '/manage/qualityParameters/' + qpId,
    method: 'delete'
  })
}

// 导出质量参数设置
export function exportQualityParameters(query) {
  return request({
    url: '/manage/qualityParameters/export',
    method: 'get',
    params: query
  })
}