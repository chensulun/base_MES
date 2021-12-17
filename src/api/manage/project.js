import request from '@/utils/request'

// 查询项目列表列表
export function listProject(query) {
  return request({
    url: '/manage/project/list',
    method: 'get',
    params: query
  })
}

// 查询项目列表列表(通过站点id)
export function listProjectByMsId(query) {
  return request({
    url: '/manage/project/listByMsId',
    method: 'get',
    params: query
  })
}

// 查询项目列表详细
export function getProject(projectId) {
  return request({
    url: '/manage/project/' + projectId,
    method: 'get'
  })
}

// 新增项目列表
export function addProject(data) {
  return request({
    url: '/manage/project',
    method: 'post',
    data: data
  })
}

// 修改项目列表
export function updateProject(data) {
  return request({
    url: '/manage/project',
    method: 'put',
    data: data
  })
}

// 项目合并
export function mergeProject(data) {
  return request({
    url: '/manage/project/mergeProject',
    method: 'post',
    data: data
  })
}

// 删除项目列表
export function delProject(projectId) {
  return request({
    url: '/manage/project/' + projectId,
    method: 'delete'
  })
}

// 导出项目列表
export function exportProject(query) {
  return request({
    url: '/manage/project/export',
    method: 'get',
    params: query
  })
}
