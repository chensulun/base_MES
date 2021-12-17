import request from '@/utils/request'

// 查询erp-人事关系列表
export function listPersonnelRelations(query) {
  return request({
    url: '/erp/personnelRelations/list',
    method: 'get',
    params: query
  })
}

// 查询erp-人事关系详细
export function getPersonnelRelations(prId) {
  return request({
    url: '/erp/personnelRelations/' + prId,
    method: 'get'
  })
}

// 新增erp-人事关系
export function addPersonnelRelations(data) {
  return request({
    url: '/erp/personnelRelations',
    method: 'post',
    data: data
  })
}

// 修改erp-人事关系
export function updatePersonnelRelations(data) {
  return request({
    url: '/erp/personnelRelations',
    method: 'put',
    data: data
  })
}

// 删除erp-人事关系
export function delPersonnelRelations(prId) {
  return request({
    url: '/erp/personnelRelations/' + prId,
    method: 'delete'
  })
}

// 导出erp-人事关系
export function exportPersonnelRelations(query) {
  return request({
    url: '/erp/personnelRelations/export',
    method: 'get',
    params: query
  })
}