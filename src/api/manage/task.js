import request from '@/utils/request'

// 查询任务列表
export function listTask(query) {
  return request({
    url: '/manage/task/list',
    method: 'get',
    params: query
  })
}

// 查询任务详细
export function getTask(taskId) {
  return request({
    url: '/manage/task/' + taskId,
    method: 'get'
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/manage/task',
    method: 'post',
    data: data
  })
}

// 修改任务
export function updateTask(data) {
  return request({
    url: '/manage/task',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delTask(taskId) {
  return request({
    url: '/manage/task/' + taskId,
    method: 'delete'
  })
}

// 导出任务
export function exportTask(query) {
  return request({
    url: '/manage/task/export',
    method: 'get',
    params: query
  })
}