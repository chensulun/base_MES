import request from '@/utils/request'

// 查询工资管理列表
export function listSalaryManagement(query) {
  return request({
    url: '/erp/salaryManagement/list',
    method: 'get',
    params: query
  })
}

// 查询工资管理详细
export function getSalaryManagement(smId) {
  return request({
    url: '/erp/salaryManagement/' + smId,
    method: 'get'
  })
}

// 新增工资管理
export function addSalaryManagement(data) {
  return request({
    url: '/erp/salaryManagement',
    method: 'post',
    data: data
  })
}

// 修改工资管理
export function updateSalaryManagement(data) {
  return request({
    url: '/erp/salaryManagement',
    method: 'put',
    data: data
  })
}

// 删除工资管理
export function delSalaryManagement(smId) {
  return request({
    url: '/erp/salaryManagement/' + smId,
    method: 'delete'
  })
}

// 导出工资管理
export function exportSalaryManagement(query) {
  return request({
    url: '/erp/salaryManagement/export',
    method: 'get',
    params: query
  })
}

// 社保金额
export function getInsurance() {
  return request({
    url: '/erp/salaryManagement/getInsurance',
    method: 'get'
  })
}

// 个税
export function getTax(query) {
  return request({
    url: '/erp/salaryManagement/getTax',
    method: 'get',
    params: query
  })
}

// 个税
export function generateCurrentMonthSalary() {
  return request({
    url: '/erp/salaryManagement/generateCurrentMonthSalary',
    method: 'get'
  })
}
