import request from '@/utils/request'

// 查询员工管理列表
export function listEmployeeManagement(query) {
  return request({
    url: '/erp/employeeManagement/list',
    method: 'get',
    params: query
  })
}

// 查询员工管理详细
export function getEmployeeManagement(emId) {
  return request({
    url: '/erp/employeeManagement/' + emId,
    method: 'get'
  })
}

// 新增员工管理
export function addEmployeeManagement(data) {
  return request({
    url: '/erp/employeeManagement',
    method: 'post',
    data: data
  })
}

// 修改员工管理
export function updateEmployeeManagement(data) {
  return request({
    url: '/erp/employeeManagement',
    method: 'put',
    data: data
  })
}

// 删除员工管理
export function delEmployeeManagement(emId) {
  return request({
    url: '/erp/employeeManagement/' + emId,
    method: 'delete'
  })
}

// 导出员工管理
export function exportEmployeeManagement(query) {
  return request({
    url: '/erp/employeeManagement/export',
    method: 'get',
    params: query
  })
}