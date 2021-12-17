import request from '@/utils/request'

// 查询质量参数列表
export function listParameters(query) {
  return request({
    url: '/manage/parameters/list',
    method: 'get',
    params: query
  })
}

// 查询质量参数详细
export function getParameters(pId) {
  return request({
    url: '/manage/parameters/' + pId,
    method: 'get'
  })
}

// 新增质量参数
export function addParameters(data) {
  return request({
    url: '/manage/parameters',
    method: 'post',
    data: data
  })
}

// 修改质量参数
export function updateParameters(data) {
  return request({
    url: '/manage/parameters',
    method: 'put',
    data: data
  })
}

// 删除质量参数
export function delParameters(pId) {
  return request({
    url: '/manage/parameters/' + pId,
    method: 'delete'
  })
}

// 导出质量参数
export function exportParameters(query) {
  return request({
    url: '/manage/parameters/export',
    method: 'get',
    params: query
  })
}