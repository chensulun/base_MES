import request from '@/utils/request'

// 查询环境卫生记录列表
export function listCleanRecord(query) {
  return request({
    url: '/erp/cleanRecord/list',
    method: 'get',
    params: query
  })
}

// 查询环境卫生记录详细
export function getCleanRecord(crId) {
  return request({
    url: '/erp/cleanRecord/' + crId,
    method: 'get'
  })
}

// 新增环境卫生记录
export function addCleanRecord(data) {
  return request({
    url: '/erp/cleanRecord',
    method: 'post',
    data: data
  })
}

// 修改环境卫生记录
export function updateCleanRecord(data) {
  return request({
    url: '/erp/cleanRecord',
    method: 'put',
    data: data
  })
}

// 删除环境卫生记录
export function delCleanRecord(crId) {
  return request({
    url: '/erp/cleanRecord/' + crId,
    method: 'delete'
  })
}

// 导出环境卫生记录
export function exportCleanRecord(query) {
  return request({
    url: '/erp/cleanRecord/export',
    method: 'get',
    params: query
  })
}