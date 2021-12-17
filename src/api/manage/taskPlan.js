import request from '@/utils/request'

// 查询生产计划列表
export function listTaskPlan(query) {
  return request({
    url: '/manage/taskPlan/list',
    method: 'get',
    params: query
  })
}

// 查询生产计划详细
export function getTaskPlan(taskPlanId) {
  return request({
    url: '/manage/taskPlan/' + taskPlanId,
    method: 'get'
  })
}

// 新增生产计划
export function addTaskPlan(data) {
  return request({
    url: '/manage/taskPlan',
    method: 'post',
    data: data
  })
}

// 修改生产计划
export function updateTaskPlan(data) {
  return request({
    url: '/manage/taskPlan',
    method: 'put',
    data: data
  })
}

// 删除生产计划
export function delTaskPlan(taskPlanId) {
  return request({
    url: '/manage/taskPlan/' + taskPlanId,
    method: 'delete'
  })
}

// 导出生产计划
export function exportTaskPlan(query) {
  return request({
    url: '/manage/taskPlan/export',
    method: 'get',
    params: query
  })
}