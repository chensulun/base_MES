import request from '@/utils/request'

// 查询入库计划列表
export function listWarehousingPlan(query) {
  return request({
    url: '/manage/warehousingPlan/list',
    method: 'get',
    params: query
  })
}

// 查询入库计划详细
export function getWarehousingPlan(wpId) {
  return request({
    url: '/manage/warehousingPlan/' + wpId,
    method: 'get'
  })
}

// 新增入库计划
export function addWarehousingPlan(data) {
  return request({
    url: '/manage/warehousingPlan',
    method: 'post',
    data: data
  })
}

// 修改入库计划
export function updateWarehousingPlan(data) {
  return request({
    url: '/manage/warehousingPlan',
    method: 'put',
    data: data
  })
}

// 删除入库计划
export function delWarehousingPlan(wpId) {
  return request({
    url: '/manage/warehousingPlan/' + wpId,
    method: 'delete'
  })
}

// 导出入库计划
export function exportWarehousingPlan(query) {
  return request({
    url: '/manage/warehousingPlan/export',
    method: 'get',
    params: query
  })
}