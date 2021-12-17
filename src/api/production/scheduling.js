import request from '@/utils/request'


// 更新任务单状态
export function updateTaskStatus(data) {
  return request({
    url: '/production/scheduling/updateTaskStatus',
    method: 'post',
    data: data
  })
}


// 车辆排队信息
export function queue(prId) {
  return request({
    url: '/production/scheduling/queue/' + prId,
    method: 'get',
  })
}

// 更新车辆排队信息
export function changeQueue(data) {
  return request({
    url: '/production/scheduling/changeQueue',
    method: 'post',
    data: data
  })
}

// 总计结果
export function countValue(msId) {
  return request({
    url: '/production/scheduling/count/' + msId,
    method: 'get',
  })
}
