import request from '@/utils/request'

// 查询员工考勤(上传)列表
export function listAttendanceUpload(query) {
  return request({
    url: '/erp/attendanceUpload/list',
    method: 'get',
    params: query
  })
}

// 查询员工考勤(上传)详细
export function getAttendanceUpload(apId) {
  return request({
    url: '/erp/attendanceUpload/' + apId,
    method: 'get'
  })
}

// 新增员工考勤(上传)
export function addAttendanceUpload(data) {
  return request({
    url: '/erp/attendanceUpload',
    method: 'post',
    data: data
  })
}

// 修改员工考勤(上传)
export function updateAttendanceUpload(data) {
  return request({
    url: '/erp/attendanceUpload',
    method: 'put',
    data: data
  })
}

// 删除员工考勤(上传)
export function delAttendanceUpload(apId) {
  return request({
    url: '/erp/attendanceUpload/' + apId,
    method: 'delete'
  })
}

// 导出员工考勤(上传)
export function exportAttendanceUpload(query) {
  return request({
    url: '/erp/attendanceUpload/export',
    method: 'get',
    params: query
  })
}