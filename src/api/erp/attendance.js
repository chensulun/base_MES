import request from '@/utils/request'

// 查询员工考勤列表
export function listAttendance(query) {
  return request({
    url: '/erp/attendance/list',
    method: 'get',
    params: query
  })
}

// 查询员工考勤详细
export function getAttendance(aId) {
  return request({
    url: '/erp/attendance/' + aId,
    method: 'get'
  })
}

// 新增员工考勤
export function addAttendance(data) {
  return request({
    url: '/erp/attendance',
    method: 'post',
    data: data
  })
}

// 修改员工考勤
export function updateAttendance(data) {
  return request({
    url: '/erp/attendance',
    method: 'put',
    data: data
  })
}

// 删除员工考勤
export function delAttendance(aId) {
  return request({
    url: '/erp/attendance/' + aId,
    method: 'delete'
  })
}

// 导出员工考勤
export function exportAttendance(query) {
  return request({
    url: '/erp/attendance/export',
    method: 'get',
    params: query
  })
}