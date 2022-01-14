import request from '@/utils/request'

// 查询异常处理列表
export function listExceptionHandling(query) {
  return request({
    url: '/erp/exceptionHandling/list',
    method: 'get',
    params: query
  })
}

// 查询异常处理详细
export function getExceptionHandling(ehId) {
  return request({
    url: '/erp/exceptionHandling/' + ehId,
    method: 'get'
  })
}

// 新增异常处理
export function addExceptionHandling(data) {
  return request({
    url: '/erp/exceptionHandling',
    method: 'post',
    data: data
  })
}

// 修改异常处理
export function updateExceptionHandling(data) {
  return request({
    url: '/erp/exceptionHandling',
    method: 'put',
    data: data
  })
}

// 删除异常处理
export function delExceptionHandling(ehId) {
  return request({
    url: '/erp/exceptionHandling/' + ehId,
    method: 'delete'
  })
}

// 导出异常处理
export function exportExceptionHandling(query) {
  return request({
    url: '/erp/exceptionHandling/export',
    method: 'get',
    params: query
  })
}