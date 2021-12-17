import request from '@/utils/request'

// 查询站点磅房信息列表
export function listPoundRoom(query) {
  return request({
    url: '/manage/poundRoom/list',
    method: 'get',
    params: query
  })
}

// 查询站点磅房信息详细
export function getPoundRoom(prId) {
  return request({
    url: '/manage/poundRoom/' + prId,
    method: 'get'
  })
}

// 新增站点磅房信息
export function addPoundRoom(data) {
  return request({
    url: '/manage/poundRoom',
    method: 'post',
    data: data
  })
}

// 修改站点磅房信息
export function updatePoundRoom(data) {
  return request({
    url: '/manage/poundRoom',
    method: 'put',
    data: data
  })
}

// 删除站点磅房信息
export function delPoundRoom(prId) {
  return request({
    url: '/manage/poundRoom/' + prId,
    method: 'delete'
  })
}

// 导出站点磅房信息
export function exportPoundRoom(query) {
  return request({
    url: '/manage/poundRoom/export',
    method: 'get',
    params: query
  })
}