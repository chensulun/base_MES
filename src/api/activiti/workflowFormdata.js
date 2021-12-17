import request from '@/utils/request'

// 查询审核记录列表
export function listWorkflowFormdata(query) {
  return request({
    url: '/activiti/workflowFormdata/list',
    method: 'get',
    params: query
  })
}
