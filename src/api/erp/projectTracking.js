import request from '@/utils/request'

// 查询项目追踪列表
export function listProjectTracking(query) {
  return request({
    url: '/erp/projectTracking/list',
    method: 'get',
    params: query
  })
}

// 查询项目追踪详细
export function getProjectTracking(ptId) {
  return request({
    url: '/erp/projectTracking/' + ptId,
    method: 'get'
  })
}

// 新增项目追踪
export function addProjectTracking(data) {
  return request({
    url: '/erp/projectTracking',
    method: 'post',
    data: data
  })
}

// 修改项目追踪
export function updateProjectTracking(data) {
  return request({
    url: '/erp/projectTracking',
    method: 'put',
    data: data
  })
}

// 删除项目追踪
export function delProjectTracking(ptId) {
  return request({
    url: '/erp/projectTracking/' + ptId,
    method: 'delete'
  })
}

// 导出项目追踪
export function exportProjectTracking(query) {
  return request({
    url: '/erp/projectTracking/export',
    method: 'get',
    params: query
  })
}